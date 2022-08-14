const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/userAuth");
const { Sequelize } = require("sequelize");

router.get("/", userAuth, async (req, res) => {
  const courses = await Course.findAll({
    order: Sequelize.literal("id DESC"),
    limit: 6,
  });
  const id = req.id;
  if (id) {
    let user = await User.findOne({
      where: {
        id: id,
      }
    });
    res.render("home", {
      user: user,
      courses: courses,
      navStatusHome: "active",
      navStatusAbout: "",
      navStatusCourses: "",
      navStatusEnrolledCourses:""
    });
  } else {
    res.render("home", {
      courses: courses,
      navStatusHome: "active",
      navStatusAbout: "",
      navStatusCourses: ""
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("jwttoken");
  res.redirect("/");
});

router.post("/", async (req, res) => {
  let userEmail = req.body.email;
  let userPassword = req.body.password;

  let user = await User.findOne({
    where: { email: userEmail },
  });

  try {
    if (user) {
      let passCheck = bcrypt.compareSync(userPassword, user.passwordHash);
      if (passCheck) {
        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign({ userId: user.id }, secretKey, {
          expiresIn: "1h",
        });
        res.cookie("jwttoken", token, {
          maxAge: 1000000,
          httpOnly: true,
        });

        res.render("home", {
          navStatusHome: "active",
          navStatusAbout: "",
          navStatusCourses: "",
          navStatusEnrolledCourses:"",
          user: user,
        });
      } else {
        res.render("home", {
          message: "Wrong Email Or Password",
          navStatusHome: "active",
          navStatusAbout: "",
          navStatusCourses: "",
        });
      }
    } else {
      res.render("home", {
        message: "No User Found With Given Email",
        navStatusHome: "active",
        navStatusAbout: "",
        navStatusCourses: "",
      });
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
