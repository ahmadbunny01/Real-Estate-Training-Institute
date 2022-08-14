const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { userAuth } = require("../middlewares/userAuth");

router.get("/", userAuth, async (req, res) => {
  const id = req.id;
  if (id) {
    let user = await User.findOne({
      where:{
        id:id
      }
    })
    res.render("about",{
      navStatusHome:"",
      navStatusAbout:"active",
      navStatusCourses:"",
      navStatusEnrolledCourses:"",
      user:user
    });
  } else {
    res.render("about",{
      navStatusHome:"",
      navStatusAbout:"active",
      navStatusCourses:"",
    });
  }
});

module.exports = router;
