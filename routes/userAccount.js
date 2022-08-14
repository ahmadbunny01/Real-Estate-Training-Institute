const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/userAuth");

router.get("/", userAuth, async (req, res) => {
  const id = req.id;
  let user = await User.findOne({
    where: {
      id: id,
    },
  });
  res.render("userAccount", {
    user: user,
  });
});

router.post(
  "/",
  userAuth,
  [
    check("email", "Please Enter A Valid Email").isEmail(),
    check("phone", "Please Enter A Valid Phone Number").isNumeric(),
    check("city", "Please Enter A Valid City Name").isAlpha(),
  ],
  async (req, res) => {
    const id = req.id;
    if (id) {
      const errors = validationResult(req);
      let user = await User.findOne({
        where: {
          id: id,
        },
      });
      if (!errors.isEmpty()) {
        const alert = errors.array();
        res.render("userAccount", {
          user: user,
          alert: alert,
        });
      } else {
        try {
          let password = req.body.password;
          let confirmPassword = req.body.confirmPassword;

          if (password == confirmPassword) {
            let hash = bcrypt.hashSync(password, 10);
            user.update({
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
              res.render("userAccount", {
                user: user,
                msg: "Saved Changes",
              });
            } else {
              res.render("userAccount", {
                user: user,
                msg: "Failed To Save Changes. Try Refreshing The Page",
              });
            }
          } else {
            res.render("userAccount", {
              user: user,
              error: "Passwords Do Not Match",
            });
          }
        } catch (err) {
          console.log(err);
          res.redirect("userAccount");
        }
      }
    } else {
      res.send("<h1>Not Found</h1>");
    }
  }
);

module.exports = router;
