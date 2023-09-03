const router = require("express").Router();
const passport = require("passport");

const {
  admin_events,
  admin_newevents,
  admin_saveevent,
  admin_editevents,
  admin_updateevents,
  admin_delevents,
} = require("../controllers/events");

// const {
//   admin_sermons,
//   admin_editsermons,
//   admin_newsermons,
//   admin_savesermon,
//   admin_updatesermons,
//   admin_delsermons,
// } = require("../controllers/sermons");

// const {
//   admin_writers,
//   admin_newwriters,
//   admin_savewriter,
//   admin_editwriters,
//   admin_updatewriters,
//   admin_delwriters,
// } = require("../controllers/writers");

// const {
//   admin_delcategories,
//   admin_savecategory,
//   admin_updatecategory,
// } = require("../controllers/blogcategories");

// const {
//   admin_blogs,
//   admin_newblogs,
//   admin_editblogs,
//   admin_createblog,
//   admin_viewblogs,
//   admin_updateblogs,
//   admin_delblogs,
// } = require("../controllers/blogs");

const {
  checkNotAuthenticated,
  checkAuthenticated,
  admin_users,
  admin_addusers,
  admin_deluser,
  admin_reset,
  admin_edituser,
  admin_changepasspage,
  admin_changepass,
  admin_resetpass,
  genOtp,
  getOtp,
} = require("../controllers/users");

const { adminDashboard } = require("../controllers/static");

// const { admin_delcomments } = require("../controllers/blogcomments");

router.get("/", checkAuthenticated, adminDashboard);

// auth routes
router
  .route("/users")
  .get(checkAuthenticated, admin_users)
  .post(checkAuthenticated, admin_addusers);
router
  .route("/login")
  .get(checkNotAuthenticated, (req, res) => {
    res.render("admin/login");
  })
  .post(
    checkNotAuthenticated,
    passport.authenticate("local", {
      failureRedirect: "back",
      failureFlash: true,
    }),
    (req, res) => {
      res.redirect("back");
    }
  );
router.put("/user/reset/:id", checkAuthenticated, admin_reset);
router.put("/user/update/:id", checkAuthenticated, admin_edituser);
router.put("/user/updatepass", checkAuthenticated, admin_changepass);
router.get("/user/updatepass", checkAuthenticated, admin_changepasspage);
router.delete("/user/delete/:id", checkAuthenticated, admin_deluser);
router.delete("/logout", checkAuthenticated, (req, res) => {
  req.logOut((err) => {
    if (err) {
      res.redirect("back");
    }
    res.redirect("/admin/login");
  });
});

// router.get("/otp", checkNotAuthenticated, getOtp);
// router.post("/otp", checkNotAuthenticated, genOtp);
// router.post("/reset/password", checkNotAuthenticated, admin_resetpass);

//events
router
  .route("/events")
  .get(checkAuthenticated, admin_events)
  .post(checkAuthenticated, admin_saveevent);
router.get("/events/new", checkAuthenticated, admin_newevents);
router
  .route("/events/edit/:id")
  .get(checkAuthenticated, admin_editevents)
  .put(checkAuthenticated, admin_updateevents);
router.delete("/events/delete/:id", checkAuthenticated, admin_delevents);

// //sermons
// router
//   .route("/sermons")
//   .get(checkAuthenticated, admin_sermons)
//   .post(checkAuthenticated, admin_savesermon);
// router.get("/sermons/new", checkAuthenticated, admin_newsermons);
// router
//   .route("/sermons/edit/:id")
//   .get(checkAuthenticated, admin_editsermons)
//   .put(checkAuthenticated, admin_updatesermons);
// router.delete("/sermons/delete/:id", checkAuthenticated, admin_delsermons);

// //writers
// router
//   .route("/writers")
//   .get(checkAuthenticated, admin_writers)
//   .post(checkAuthenticated, admin_savewriter);
// router.get("/writers/new", checkAuthenticated, admin_newwriters);
// router
//   .route("/writers/edit/:id")
//   .get(checkAuthenticated, admin_editwriters)
//   .put(checkAuthenticated, admin_updatewriters);
// router.delete("/writers/delete/:id", checkAuthenticated, admin_delwriters);

// // blog categories
// router.post("/blogs/category", checkAuthenticated, admin_savecategory);
// router.delete(
//   "/blogs/category/delete/:id",
//   checkAuthenticated,
//   admin_delcategories
// );
// router.put(
//   "/blogs/category/edit/:id",
//   checkAuthenticated,
//   admin_updatecategory
// );

// //blogs
// router
//   .route("/blogs")
//   .get(checkAuthenticated, admin_blogs)
//   .post(checkAuthenticated, admin_createblog);
// router
//   .route("/blogs/edit/:id")
//   .get(checkAuthenticated, admin_editblogs)
//   .put(checkAuthenticated, admin_updateblogs);
// router.get("/blogs/new", checkAuthenticated, admin_newblogs);
// router.get("/blogs/view/:id", checkAuthenticated, admin_viewblogs);
// router.delete("/blogs/delete/:id", checkAuthenticated, admin_delblogs);
// router.delete(
//   "/blogs/comments/delete/:id",
//   checkAuthenticated,
//   admin_delcomments
// );

module.exports = router;
