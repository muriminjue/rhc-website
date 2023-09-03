const logger = require("../config/logger");
const { Writers, Blogs, Blogcategories } = require("../models");

const imagefolder = "public/uploads/images/";

const admin_writers = async (req, res) => {
  try {
    let writers = await Writers.findAll({ order: [["createdAt", "DESC"]] });
    res.render("admin/writers", { writers });
    logger.info("Admin writers page requested");
  } catch (error) {
    logger.error("Admin writers page could not render due to: " + error);
    res.render("admin/500");
  }
};

const admin_editwriters = async (req, res) => {
  try {
    let writer = await Writers.findByPk(req.params.id);
    res.render("admin/writersedit", { writer });
    logger.info("Admin writers edit page requested");
  } catch (error) {
    logger.error("Admin writers edit page could not render due to: " + error);
    res.render("admin/500");
  }
};

const admin_newwriters = async (req, res) => {
  try {
    res.render("admin/writersnew", { writer: Writers.build() });
    logger.info("Admin create writer page requested");
  } catch (error) {
    logger.error("Admin new writers page could not render due to: " + error);
    res.render("admin/500");
  }
};

const admin_savewriter = async (req, res) => {
  try {
    const {
        writer_fullname,
        writer_email,
        writer_description,
      } = req.body,
      { writer_image } = req.files;

    await writer_image.mv(imagefolder + writer_image.name);
    let newWriter = Writers.build({
        writer_fullname,
        writer_email,
        writer_description,
        writer_image: writer_image.name,
    });
    await newWriter.save();
    logger.info("Admin created a new writer")
    res.redirect("writers");
  } catch (error) {
    logger.error("Admin could not save writer due to: " + error);
    res.render("admin/500");
  }
};

const admin_updatewriters = async (req, res) => {
  try {
    let writer = await Writers.findByPk(req.params.id);
    if (req.files?.writer_image)
      req.files?.writer_image.mv(imagefolder + req.files?.writer_image.name);
    await Writers.update(
      {
        ...req.body,
        writer_image: req.files?.writer_image
          ? req.files?.writer_image?.name
          : writer.writer_image,
      },
      { where: { id: req.params.id } }
    );
    logger.info(`${req.params.id} writer details updated`);
    res.redirect("/admin/writers");
  } catch (error) {
    logger.error("Admin could not update writer due to: " + error);
    res.render("admin/500");
  }
};

const admin_delwriters = async (req, res) => {
  try {
    let writer = await Writers.findByPk(req.params.id);
    await Writers.destroy({ where: { id: writer.id } });
    logger.info(`${req.params.id} writer deleted`);
    res.redirect("back");
  } catch (error) {
    logger.error("Admin could not delete writer due to: " + error);
    res.render("admin/500");
  }
};

const user_writer  = async (req,res)=>{
  try {
    let writer = await Writers.findByPk(req.params.id, {include:[{model: Blogs, include:[{model: Blogcategories}] }]})
    res.render("website/blogwriters", { writer });
    logger.info("user writers page requested");
  } catch (error) {
    logger.error("User could not render writer page due to: " + error);
    res.render("website/error");
  }
}

module.exports = {
  admin_writers,
  admin_newwriters,
  admin_savewriter,
  admin_editwriters,
  admin_updatewriters,
  admin_delwriters,
  user_writer
};
