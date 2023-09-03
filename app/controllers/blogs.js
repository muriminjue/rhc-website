const slugify = require("slugify");

const logger = require("../config/logger");
const { Blogs, Blogcategories, Writers, Blogcomments } = require("../models");

const imagefolder = "public/uploads/images/";

const admin_blogs = async (req, res) => {
  try {
    let blogs = await Blogs.findAll({
      order: [["createdAt", "DESC"]],
      include: [{ model: Blogcategories }, { model: Writers }],
    });
    let categories = await Blogcategories.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.render("admin/blogs", { blogs, categories });
    logger.info("Admin blogs page requested");
  } catch (error) {
    logger.error("Admin blogs page could not render due to: " + error);
    res.render("admin/500");
  }
};

const admin_viewblogs = async (req, res) => {
  try {
    let blog = await Blogs.findOne({
      where: { id: req.params.id },
      include: [
        { model: Blogcategories },
        { model: Writers },
        { model: Blogcomments },
      ],
    });
    res.render("admin/blogsview", {
      blog,
    });
    logger.info("Admin view blog page requested");
  } catch (error) {
    logger.error("Admin blog view page could not render due to: " + error);
    res.render("admin/500");
  }
};

const admin_editblogs = async (req, res) => {
  try {
    let blog = await Blogs.findOne({
      where: { id: req.params.id },
      include: [{ model: Blogcategories }, { model: Writers }],
    });
    res.render("admin/blogsedit", {
      blog,
      authors: await Writers.findAll(),
      categories: await Blogcategories.findAll(),
    });
    logger.info("Admin update blog page requested");
  } catch (error) {
    logger.error("Admin blog update page could not render due to: " + error);
    res.render("admin/500");
  }
};

const admin_updateblogs = async (req, res) => {
  try {
    let blog = await Blogs.findByPk(req.params.id);
    if (req.files?.blog_image) {
      req.files?.blog_image.mv(imagefolder + req.files?.blog_image?.name);
    }
    await Blogs.update(
      {
        ...req.body,
        categoryId: req.body.categoryId == "null" ? null : req.body.categoryId,
        blog_image: req.files?.blog_image
          ? req.files?.blog_image?.name
          : blog.blog_image,
      },
      { where: { id: req.params.id } }
    );
    logger.info(`${req.params.id} blog details updated`);
    res.redirect("/admin/blogs/view/" + blog.id);
  } catch (error) {
    logger.error("Admin blogs edit page could not render due to: " + error);
    res.render("admin/500");
  }
};

const admin_newblogs = async (req, res) => {
  try {
    res.render("admin/blogsnew", {
      blog: Blogs.build(),
      authors: await Writers.findAll(),
      categories: await Blogcategories.findAll(),
    });
    logger.info("Admin create blog page requested");
  } catch (error) {
    logger.error("Admin new blogs page could not render due to: " + error);
    res.render("admin/500");
  }
};

const admin_createblog = async (req, res) => {
  try {
    const { blog_title, blog_content, blog_description, categoryId, writerId } =
        req.body,
      { blog_image } = req.files;

    await blog_image.mv(imagefolder + blog_image.name);
    let newBlog = Blogs.build({
      blog_slug: await slugify(blog_title.toLowerCase()),
      blog_title,
      blog_content,
      blog_description,
      categoryId: categoryId || null,
      writerId,
      blog_image: blog_image.name,
    });
    await newBlog.save();
    res.redirect("/admin/blogs");
  } catch (error) {
    logger.error("Admin could not add new blog  due to: " + error);
    res.render("admin/500");
  }
};

const admin_delblogs = async (req, res) => {
  try {
    let blog = await Blogs.findByPk(req.params.id);
    await Blogs.destroy({ where: { id: blog.id } });
    logger.info(`${req.params.id} blog deleted`);
    res.redirect("/admin/blogs");
  } catch (error) {
    logger.error("Admin could not delete blog due to: " + error);
    res.render("admin/500");
  }
};

const user_blogs = async (req, res) => {
  try {
    let blogs = await Blogs.findAll({
        order: [["createdAt", "DESC"]],
        include: [{ model: Blogcategories }, { model: Writers }],
        limit: 12,
        offset: (parseInt(req.params.page) - 1) * 1,
      }),
      blogsCount = await Blogs.count(),
      categories = await Blogcategories.findAll({
        order: [["createdAt", "DESC"]],
      });
    res.render("website/blogs", {
      blogs,
      categories,
      blogsCount,
      currentPage: req.params.page,
    });
    logger.info("User blogs page requested");
  } catch (error) {
    logger.error("User blogs page could not render due to: " + error);
    res.render("website/error");
  }
};

const user_singleblogs = async (req, res) => {
  try {
    let blog = await Blogs.findOne({
      where: {
        blog_slug: req.params.slug,
      },
      include: [
        { model: Blogcategories },
        { model: Writers },
        { model: Blogcomments, order: [["createdAt", "DESC"]] },
      ],
    });
    res.render("website/blogsingle", {
      blog,
      url: req.protocol + "://" + req.get("host") + req.originalUrl,
    });
    logger.info("User single blog page requested");
  } catch (error) {
    logger.error("User single blog page could not render due to: " + error);
    res.render("website/error");
  }
};

module.exports = {
  admin_blogs,
  admin_newblogs,
  admin_editblogs,
  admin_createblog,
  admin_viewblogs,
  admin_updateblogs,
  admin_delblogs,
  user_blogs,
  user_singleblogs,
};
