const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt")

const { Users } = require("../models");

const initialise = (passport) => {
  const authenticateUser = async (email, password, done) => {
    const user = await Users.findOne({ where: { user_email: email } });
    if (!user) {
      return done(null, false, { message: "No user with that email" });
    }

    try {
      if (await bcrypt.compare(password, user.user_password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    return done(null, await Users.findByPk(id));
  });
};

module.exports = initialise;
