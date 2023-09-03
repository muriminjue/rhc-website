const router = require("express").Router();

// const { user_sermons, user_singlesermons } = require("../controllers/sermons");
const { user_events, user_singleevents } = require("../controllers/events");
// const {user_blogs, user_singleblogs} = require("../controllers/blogs")
// const {user_blogcategories} = require("../controllers/blogcategories")
// const {save_comments} = require("../controllers/blogcomments")
// const {user_writer} = require("../controllers/writers")
const {homePage, leadersPage, aboutPage} = require("../controllers/static")


router.get("/", homePage);

// router.get("/about", aboutPage);
// router.get("/leaders", leadersPage);

// // sermons
// router.get("/sermons",(req,res)=>{res.redirect("/sermons/1")})
// router.get("/sermons/:page", user_sermons);
// router.get("/sermons/listen/:id", user_singlesermons);

// events
router.get("/events", user_events);
router.get("/events/:id", user_singleevents);

// // blogs
// router.get("/blogs",(req,res)=>{res.redirect("/blogs/1")})
// router.get("/blogs/:page",user_blogs)
// router.get("/blogs/category/:id",user_blogcategories)
// router.get("/blogs/author/:id",user_writer)
// router.get("/blogs/post/:slug", user_singleblogs)
// router.post("/blog/comment/:blogId", save_comments)



module.exports = router;
