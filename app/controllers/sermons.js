const { Sermons } = require("../models");
const logger = require("../config/logger");

const imagefolder = "public/uploads/images/";
const audiofolder = "public/uploads/audios/";


const admin_sermons = async (req, res) => {
    try {
        let sermons = await Sermons.findAll({ order: [["createdAt", "DESC"]] });
        res.render("admin/sermons", { sermons });
        logger.info("Admin sermons page requested");
    } catch (error) {
        logger.error("Admin sermons page could not render due to: " + error);
        res.render("admin/500");
    }
};

const admin_editsermons = async (req, res) => {
    try {
        let sermon = await Sermons.findByPk(req.params.id);
        res.render("admin/sermonsedit", { sermon });
        logger.info("Admin sermons edit page requested");
    } catch (error) {
        logger.error("Admin sermons edit page could not render due to: " + error);
        res.render("admin/500");
    }
};

const admin_newsermons = async (req, res) => {
    try {
        res.render("admin/sermonsnew", { sermon: Sermons.build() });
        logger.info("Admin create sermon page requested");
    } catch (error) {
        logger.error("Admin new sermons page could not render due to: " + error);
        res.render("admin/500");
    }
};

const admin_savesermon = async (req, res) => {
    try {
        const {
            sermon_title,
            sermon_date,
            sermon_speaker,
            sermon_location,
            sermon_videolink,
            sermon_description,
        } = req.body,
            { sermon_poster, sermon_audio } = req.files;

        await sermon_poster.mv(imagefolder + sermon_poster.name);
        await sermon_audio.mv(audiofolder + sermon_audio.name);
        let newSermon = Sermons.build({
            sermon_title,
            sermon_date,
            sermon_speaker,
            sermon_location,
            sermon_videolink,
            sermon_description,
            sermon_poster: sermon_poster.name,
            sermon_audio: sermon_audio.name
        });
        await newSermon.save();
        res.redirect("sermons");
    } catch (error) {
        logger.error("Admin could not save sermon due to: " + error);
        res.render("admin/500");
    }
};

const admin_updatesermons = async (req, res) => {
    try {
        let sermon = await Sermons.findByPk(req.params.id);
        if (req.files?.sermon_poster) req.files?.sermon_poster.mv(imagefolder + req.files?.sermon_poster.name);
        await Sermons.update(
            {
                ...req.body,
                sermon_poster: req.files?.sermon_poster
                    ? req.files?.sermon_poster?.name
                    : sermon.sermon_poster,
            },
            { where: { id: req.params.id } }
        );
        logger.info(`${req.params.id} sermon details updated`);
        res.redirect("/admin/sermons");
    } catch (error) {
        logger.error("Admin could not update sermon due to: " + error);
        res.render("admin/500");
    }
};

const admin_delsermons = async (req, res) => {
    try {
        let sermon = await Sermons.findByPk(req.params.id);
        await Sermons.destroy({ where: { id: sermon.id } })
        logger.info(`${req.params.id} sermon deleted`)
        res.redirect("back")
    } catch (error) {
        logger.error("Admin could not delete sermon due to: " + error);
        res.render("admin/500");
    }
}


const user_sermons = async (req, res) => {
    try {
        let page = req.params.page || 1
        let sermons = await Sermons.findAll({ order: [["sermon_date", "DESC"]], limit: 15, offset: parseInt(page-1)*1 });
        let sermonsCount = await Sermons.count()

        res.render("website/sermons", { sermons, sermonsCount, currentPage: req.params.page });
        logger.info("User sermons page requested");
    } catch (error) {
        logger.error("User sermons page could not render due to: " + error);
        res.render("website/error");
    }
};

const user_singlesermons = async (req, res) => {
    try {
        let sermon = await Sermons.findByPk(req.params.id);
        res.render("website/sermonsingle", { sermon, url:req.protocol + '://' + req.get('host') + req.originalUrl });
        logger.info("User single sermon page requested");
    } catch (error) {
        logger.error("User single sermon page could not render due to: " + error);
        res.render("website/error");
    }
};

module.exports = { admin_sermons, admin_editsermons, admin_newsermons, admin_savesermon , admin_updatesermons, admin_delsermons, user_sermons, user_singlesermons};
