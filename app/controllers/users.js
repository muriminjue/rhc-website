const bcrypt = require("bcrypt");
const generator = require("generate-password");
const { generate } = require("otp-generator");

const logger = require("../config/logger");
const { Users, Otps } = require("../models");
const sendemail = require("../services/email");

const admin_users = async (req, res) => {
  try {
    let users = await Users.findAll({ order: [["createdAt", "DESC"]] });
    res.render("admin/users", { users });
    logger.info("Admin users page requested");
  } catch (error) {
    logger.error("Admin users page could not render due to: " + error);
    res.render("admin/500");
  }
};

const admin_addusers = async (req, res) => {
  try {
    const { user_fullname, user_email } = req.body,
      user_password = generator.generate({
        length: 8,
        numbers: true,
      });
    let newUser = Users.build({
      user_fullname,
      user_email,
      user_password: await bcrypt.hash(
        user_password,
        parseInt(process.env.SALT)
      ),
    });
    await newUser.save();
    let email = {
      sendto: newUser.user_email,
      subject: "User Account",
      template: "newuser",
      context: { userinfo: { password: user_password, username: user_email } },
    };
    await sendemail(email);
    logger.info("Admin created new user");
    res.redirect("/admin/users");
  } catch (error) {
    logger.error("Admin could not save users due to: " + error);
    res.render("admin/500");
  }
};

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.render("admin/login");
};

const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/admin");
  }
  next();
};

const admin_reset = async (req, res) => {
  try {
    let user = await Users.findByPk(req.params.id),
      user_password = generator.generate({
        length: 8,
        numbers: true,
      });
    await Users.update(
      {
        user_password: await bcrypt.hash(
          user_password,
          parseInt(process.env.SALT)
        ),
      },
      { where: { id: user.id } }
    );
    let email = {
      sendto: user.user_email,
      subject: "Password Reset",
      template: "adminreset",
      context: { user_password },
    };
    await sendemail(email);
    logger.info("Admin reset user password");
    res.redirect("back");
  } catch (error) {
    logger.error(`Could not reset user due to ${e}`);
    res.render("admin/500");
  }
};

const admin_deluser = async (req, res) => {
  try {
    let user = await Users.findByPk(req.params.id);
    await Users.destroy({ where: { id: user.id } });
    logger.info(`${req.params.id} user deleted`);
    res.redirect("back");
  } catch (e) {
    logger.error(`Could not delete user due to ${e}`);
    res.render("admin/500");
  }
};

const admin_edituser = async (req, res) => {
  try {
    let user = await Users.findByPk(req.params.id);
    await Users.update({ ...req.body }, { where: { id: user.id } });
    logger.info("Admin updated user information");
    res.redirect("back");
  } catch (error) {
    logger.error(`Could not update user due to ${error}`);
    res.render("admin/500");
  }
};

const admin_changepasspage = async (req, res) => {
  try {
    res.render("admin/changepass", { message: "" });
    logger.info("Admin rendered user password update page");
  } catch (error) {
    logger.error(`Could not render update user password page due to ${error}`);
    res.render("admin/500");
  }
};

const admin_changepass = async (req, res) => {
  try {
    const { new_password, new_password1, old_password } = req.body,
      user = await Users.findByPk(req.session?.passport?.user);
    if (await bcrypt.compare(old_password, user.user_password)) {
      if (new_password === new_password1) {
        await Users.update(
          {
            user_password: await bcrypt.hash(
              new_password,
              parseInt(process.env.SALT)
            ),
          },
          { where: { id: user.id } }
        );
        logger.info("Admin changed password");
        res.redirect("/admin");
      } else {
        logger.error(
          "Admin could not change password due to passwords not matching"
        );
        res.render("admin/changepass", {
          message: "New Password and Repeat Password don to match",
        });
      }
    } else {
      logger.error(
        "Admin could not change password due to passwords not matching"
      );
      res.render("admin/changepass", { message: "Incorrect Old password" });
    }
  } catch (error) {
    logger.error(`Could not update user password due to ${error}`);
    res.render("admin/500");
  }
};

const admin_resetpass = async (req, res) => {
  try {
    const { new_password, new_password1, email, otp } = req.body;
    const myOtp = await Otps.findOne({ where: { email: email, otp: otp } }),
      user = await Users.findOne({ where: { user_email: email } });
    if (myOtp && otp == myOtp.otp) {
      if (new_password === new_password1) {
        await Users.update(
          {
            user_password: await bcrypt.hash(
              new_password,
              parseInt(process.env.SALT)
            ),
          },
          { where: { id: user.id } }
        );
        await Otps.destroy({
          where: {
            email: email,
          },
        });
        logger.info("Admin changed password");
        res.redirect("/admin");
      } else {
        logger.error(
          "Admin could not change password due to passwords not matching"
        );
        res.render("admin/resetpass", {
          message: "New Password and Repeat Password do not match", email: email
        });
      }
    } else {
      logger.error(
        "Admin could not change password due to passwords not matching"
      );
      res.render("admin/resetpass", { message: "OTP does not exist", email: email });
    }
  } catch (error) {
    logger.error(`Could not reset their user password due to ${error}`);
    res.redirect("admin/resetpass", { message: "An Error Occured", email: email });
  }
};

const getOtp = async (req, res) => {
  try {
    logger.info("User rendered OTP page");
    res.render("admin/otp");
  } catch (error) {
    logger.error(`Could not render OTP page due to ${error}`);
    res.render("admin/500");
  }
};

const genOtp = async (req, res) => {
  try {
    const otp = generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      }),
      user = await Users.findOne({ where: { user_email: req.body.email } });
    if (user) {
      await Otps.create({
        email: req.body.email,
        otp: otp,
      });
      let email = {
        sendto: user.user_email,
        subject: "OTP",
        template: "newOtp",
        context: { otp },
      };
      await sendemail(email);
      setTimeout(async () => {
        await Otps.destroy({
          where: {
            otp: otp,
            email: req.body.email,
          },
        });
      }, 900000);
    }
    logger.info("Admin requested OTP");
    res.render("admin/resetpass", { email: req.body.email });
  } catch (error) {
    logger.error(`Could not reset their user password due to ${error}`);
    res.redirect("back");
  }
};

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  admin_users,
  admin_addusers,
  admin_reset,
  admin_edituser,
  admin_deluser,
  admin_changepasspage,
  admin_changepass,
  genOtp,
  getOtp,
  admin_resetpass
};
