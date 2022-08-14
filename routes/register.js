const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

router.get("/", (req, res) => {
  res.render("register", {
    navStatusHome: "",
    navStatusAbout: "",
    navStatusCourses: "",
  });
});

router.post(
  "/",
  [
    check("email", "Please Enter A Valid Email").isEmail(),
    check("phone", "Please Enter A Valid Phone Number").isNumeric(),
    check("city", "Please Enter A Valid City Name").isAlpha(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render("register", {
        alert: alert,
        navStatusHome: "active",
        navStatusAbout: "",
        navStatusCourses: "",
      });
    } else {
      try {
        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;

        if (password == confirmPassword) {
          let hash = bcrypt.hashSync(password, 10);
          let user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            province: req.body.province,
            city: req.body.city,
            passwordHash: hash,
            dob: req.body.dob,
          });
          user = await user.save();
          if (user) {
            res.render("register", {
              msg: "Registration Successful",
              navStatusHome: "active",
              navStatusAbout: "",
              navStatusCourses: "",
            });
          }
        } else {
          res.render("register", {
            error: "Passwords Do Not Match",
            navStatusHome: "active",
            navStatusAbout: "",
            navStatusCourses: "",
          });
        }
      } catch (err) {
        console.log(err);
        res.redirect("/register");
      }
    }
  }
);

module.exports = router;
