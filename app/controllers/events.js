const { Op } = require("sequelize");
const logger = require("../config/logger");
const { Events } = require("../models");

const imagefolder = "public/uploads/images/";

const admin_events = async (req, res) => {
  try {
    let events = await Events.findAll({ order: [["createdAt", "DESC"]] });
    res.render("admin/events", { events });
    logger.info("Admin events page requested");
  } catch (error) {
    logger.error("Admin events page could not render due to: " + error);
    res.render("admin/500");
  }
};

const admin_editevents = async (req, res) => {
  try {
    let event = await Events.findByPk(req.params.id);
    res.render("admin/eventsedit", { event });
    logger.info("Admin events edit page requested");
  } catch (error) {
    logger.error("Admin events edit page could not render due to: " + error);
    res.render("admin/500");
  }
};

const admin_newevents = async (req, res) => {
  try {
    res.render("admin/eventsnew", { event: Events.build() });
    logger.info("Admin create event page requested");
  } catch (error) {
    logger.error("Admin new events page could not render due to: " + error);
    res.render("admin/500");
  }
};

const admin_saveevent = async (req, res) => {
  try {
    const {
        event_name,
        event_date,
        event_starttime,
        event_location,
        event_description,
      } = req.body,
      { event_poster } = req.files;

    await event_poster.mv(imagefolder + event_poster.name);
    let newEvent = Events.build({
      event_name,
      event_date,
      event_starttime,
      event_location,
      event_description,
      event_poster: event_poster.name,
    });
    await newEvent.save();
    res.redirect("events");
  } catch (error) {
    logger.error("Admin could not save event due to: " + error);
    res.render("admin/500");
  }
};

const admin_updateevents = async (req, res) => {
  try {
    let event = await Events.findByPk(req.params.id);
    if (req.files?.event_poster)
      req.files?.event_poster.mv(imagefolder + req.files?.event_poster.name);
    await Events.update(
      {
        ...req.body,
        event_poster: req.files?.event_poster
          ? req.files?.event_poster?.name
          : event.event_poster,
      },
      { where: { id: req.params.id } }
    );
    logger.info(`${req.params.id} event details updated`);
    res.redirect("/admin/events");
  } catch (error) {
    logger.error("Admin could not update event due to: " + error);
    res.render("admin/500");
  }
};

const admin_delevents = async (req, res) => {
  try {
    let event = await Events.findByPk(req.params.id);
    await Events.destroy({ where: { id: event.id } });
    logger.info(`${req.params.id} event deleted`);
    res.redirect("back");
  } catch (error) {
    logger.error("Admin could not delete event due to: " + error);
    res.render("admin/500");
  }
};

const user_events = async (req, res) => {
  try {
    let events = await Events.findAll({where:{event_date:{ [Op.gte]: new Date()}}, order: [["event_date", "ASC"]] });
    res.render("website/events", { events });
    logger.info("User events page requested");
  } catch (error) {
    logger.error("User events page could not render due to: " + error);
    res.render("website/error");
  }
};

const user_singleevents = async (req, res) => {
  try {
    let event = await Events.findByPk(req.params.id);
    res.render("website/eventsingle", {
      event,
      url: req.protocol + "://" + req.get("host") + req.originalUrl,
    });
    logger.info("User single event page requested");
  } catch (error) {
    logger.error("User single event page could not render due to: " + error);
    res.render("website/error");
  }
};

module.exports = {
  admin_events,
  admin_newevents,
  admin_saveevent,
  admin_editevents,
  admin_updateevents,
  admin_delevents,
  user_events,
  user_singleevents,
};
