const { Op } = require("sequelize");

const logger = require("../config/logger");
const { Blogs, Events, Writers, Sermons, Blogcomments } = require("../models");

const adminDashboard = async (req, res) => {
  try {
    let comments = await Blogcomments.findAll({
      include: [{ model: Blogs }],
      order: [["createdAt", "DESC"]],
      limit: 10,
    }), commentsCount = await Blogcomments.count(), blogsCount = await Blogs.count(), sermonsCount = await Sermons.count()
    res.render("admin/index", { comments, commentsCount, blogsCount, sermonsCount });
    logger.info("Admin rendered dashboard");
  } catch (error) {
    logger.error("Admin could not load dashboard due to: " + error);
    res.render("admin/500");
  }
};

const homePage = async (req, res) => {
  try {
    let events = await Events.findAll({
        where: { event_date: { [Op.gte]: new Date() } },
        order: [["event_date", "ASC"]],
        limit: 1,
      }),
      blogs = await Blogs.findAll({
        order: [["createdAt", "DESC"]],
        include: [{ model: Writers }],
        limit: 3,
      }),
      sermon = await Sermons.findOne({ order: [["sermon_date", "DESC"]] });

    res.render("website/index", { events, blogs, sermon });
    logger.info("User home page requested");
  } catch (error) {
    logger.error("User home page could not render due to: " + error);
    res.render("website/error");
  }
};

const leadersPage = (req, res) => {
  try {
    res.render("website/leaders");
    logger.info("User leaders page requested");
  } catch (error) {
    logger.error("User leaders page could not render due to: " + error);
    res.render("website/error");
  }
};

const aboutPage = (req, res) => {
  try {
    res.render("website/about");
    logger.info("User about page requested");
  } catch (error) {
    logger.error("User about page could not render due to: " + error);
    res.render("website/error");
  }
};

module.exports = { homePage, adminDashboard , leadersPage, aboutPage};
