const express = require("express");
const router = express.Router();
const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Course = require("../models/Course");
const Enrolled_Courses = require("../models/Enrolled_Courses");
const { userAuth } = require("../middlewares/userAuth");
const multer = require("multer");

let __basedir = "./";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "public/images/course");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", userAuth, async (req, res) => {
  const id = req.id;
  if (id) {
    let courses = await Course.findAll({
      order: Sequelize.literal("id DESC"),
      limit: 5,
    });

    let users = await User.findAll({
      limit: 5,
      include:[
        {
          model:Course,
          as:"enrolledCourses"
        }
      ]
    });

    let user = await User.findOne({
      where: {
        id: id,
      },
    });
    if (user.role == "admin") {
      res.render("dashboard", {
        courses: courses,
        users: users,
      });
    } else {
      res.render("adminLogin");
    }
  } else {
    res.render("adminLogin");
  }
});

router.post("/", async (req, res) => {
  let users = await User.findAll({
    order: Sequelize.literal("id DESC"),
    limit: 5,
  });

  let userEmail = req.body.email;
  let userPassword = req.body.password;

  let user = await User.findOne({
    where: { email: userEmail },
  });

  try {
    if (user && user.role == "admin") {
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

        res.render("dashboard", {
          users: users,
        });
      } else {
        res.render("adminLogin", {
          message: "Wrong Credentials",
        });
      }
    } else {
      res.render("adminLogin", {
        message: "Worng Credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.redirect("/dashboard");
  }
});

router.get("/manage-courses", userAuth, async (req, res) => {
  let courses = await Course.findAll();

  const id = req.id;
  if (id) {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });
    if (user && user.role == "admin") {
      res.render("manageCourses", {
        courses: courses,
      });
    } else {
      res.render("adminLogin");
    }
  } else {
    res.render("adminLogin");
  }
});

router.get("/manage-users", userAuth, async (req, res) => {
  const users = await User.findAll();
  const id = req.id;
  if (id) {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });
    if (user && user.role == "admin") {
      res.render("manageUsers", {
        users: users,
      });
    } else {
      res.render("adminLogin");
    }
  } else {
    res.render("adminLogin");
  }
});

router.get("/manage-courses/add", userAuth, async (req, res) => {
  const id = req.id;
  if (id) {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });
    if (user && user.role == "admin") {
      res.render("addCourse");
    } else {
      res.render("adminLogin");
    }
  } else {
    res.render("adminLogin");
  }
});

router.post("/manage-courses/add", upload.single("image"), async (req, res) => {
  if (!req.file) {
    courseImage = "default-course.jpg";
  } else {
    courseImage = req.file.filename;
  }

  try {
    let course = new Course({
      title: req.body.title,
      description: req.body.description,
      instructor: req.body.instructor,
      price: req.body.price,
      image: courseImage,
    });
    course = await course.save();
    if (course) {
      res.render("addCourse", {
        msg: "Course Added Successfully.",
      });
    } else {
      res.render("addCourse", {
        msg: "Failed To Add Course. Try Refreshing The Page.",
      });
    }
  } catch (err) {
    console.log(err);
    res.redirect("/dashboard");
  }
});

router.post("/manage-users/delete/:id", userAuth, async (req, res) => {
  const id = req.id;
  if (id) {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });
    try {
      if (user && user.role == "admin") {
        const users = await User.findAll();
        let id = req.params.id;
        await User.destroy({ where: { id: id } });
        res.render("manageUsers", {
          users: users,
          message: "User Deleted Successfully",
        });
      } else {
        const users = await User.findAll();
        res.render("manageUsers", {
          user: users,
          error: "User Not Deleted. Please Try Refreshing The Page",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
});

router.post("/manage-courses/delete/:id", userAuth, async (req, res) => {
  const id = req.id;
  if (id) {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });
    try {
      if (user && user.role == "admin") {
        const courses = await Course.findAll();
        let id = req.params.id;
        await Course.destroy({ where: { id: id } });
        res.render("manageCourses", {
          courses: courses,
          message: "Course Deleted Successfully",
        });
      } else {
        const courses = await Course.findAll();
        res.render("manageUsers", {
          courses: courses,
          error: "Course Not Deleted. Please Try Refreshing The Page",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
});

router.get("/manage-courses/edit/:id", userAuth, async (req, res) => {
  const id = req.id;
  if (id) {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });
    if (user && user.role == "admin") {
      res.render("editCourse");
    } else {
      res.render("adminLogin");
    }
  } else {
    res.render("adminLogin");
  }
});

module.exports = router;
