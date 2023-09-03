const logger = require("../config/logger");
const { Blogcategories, Blogs, Writers } = require("../models");

const admin_savecategory = async (req, res) => {
  try {
    const { category_name, category_description } = req.body;
    let newBlogcategory = Blogcategories.build({
      category_name,
      category_description,
    });
    await newBlogcategory.save();
    res.redirect("/admin/blogs");
  } catch (error) {
    logger.error("Admin could not save category due to: " + error);
    res.render("admin/500");
  }
};

const admin_updatecategory = async (req, res) => {
  try {
    let category = await Blogcategories.findByPk(req.params.id);
    await Blogcategories.update(
      {
        ...req.body,
      },
      { where: { id: category?.id } }
    );
    logger.info(`${req.params.id} category details updated`);
    res.redirect("/admin/blogs");
  } catch (error) {
    logger.error("Admin could not update category due to: " + error);
    res.render("admin/500");
  }
};

const admin_delcategories = async (req, res) => {
  try {
    let category = await Blogcategories.findByPk(req.params.id);
    await Blogcategories.destroy({ where: { id: category.id } });
    logger.info(`${req.params.id} category deleted`);
    res.redirect("back");
  } catch (error) {
    logger.error("Admin could not delete catergory due to: " + error);
    res.render("admin/500");
  }
};
const user_blogcategories = async (req, res) => {
  try {
    let blogs = await Blogs.findAll({
      where: { categoryId: req.params.id },
      include: [{model: Blogcategories},{model:Writers}],
      order: [["createdAt", "DESC"]],
    }),
     categories = await Blogcategories.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.render("website/blogcategories", { blogs, categories} );
    logger.info("User blogs page requested");
  } catch (error) {
    logger.error("User blogs page could not render due to: " + error);
    res.render("website/error");
  }
};

module.exports = {
  admin_delcategories,
  admin_savecategory,
  admin_updatecategory,
  user_blogcategories,
};
