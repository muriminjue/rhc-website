const logger = require("../config/logger");
const { Blogcomments } = require("../models");

const save_comments = async (req, res) => {
  try {
    let newComent = Blogcomments.build({
      ...req.body,blogId:req.params.blogId
    });
    newComent.save();
    res.redirect("back");
    logger.info("Blog comments saved");
  } catch (e) {
    logger.error(`Could not save comment due to ${e}`);
    res.redirect("back");
  }
};

const admin_delcomments = async (req,res)=>{
    try {
        let comment = await Blogcomments.findByPk(req.params.id);
        await Blogcomments.destroy({ where: { id: comment.id } });
        logger.info(`${req.params.id} comment deleted`);
        res.redirect("back")
    } catch (e) {
        logger.error(`Could not delete comment due to ${e}`);
        res.redirect("back");
    }
}

module.exports = { save_comments, admin_delcomments};
