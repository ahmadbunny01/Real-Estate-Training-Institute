const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
const Enrolled_Courses = require("../models/Enrolled_Courses");
const { userAuth } = require("../middlewares/userAuth");
const { Sequelize } = require("sequelize");

//PaymentGateway
const {sfpy,processPayment} = require("../utils/paymentGateway");

router.get("/", userAuth, async (req, res) => {
  const courses = await Course.findAll();
  const id = req.id;
  if (id) {
    let user = await User.findOne({
      where: {
        id: id,
      },
    });
    res.render("courses", {
      navStatusHome: "",
      navStatusAbout: "",
      navStatusCourses: "active",
      navStatusEnrolledCourses: "",
      user: user,
      courses: courses,
    });
  } else {
    res.render("courses", {
      navStatusHome: "",
      navStatusAbout: "",
      navStatusCourses: "active",
      courses: courses,
    });
  }
});

router.get("/course/:num", userAuth, async (req, res) => {
  const num = req.params.num;
  const courses = await Course.findAll({
    order: Sequelize.literal("id DESC"),
    limit: 3,
  });
  const course = await Course.findOne({
    where: {
      id: num,
    },
  });
  const id = req.id;
  if (id) {
    let user = await User.findOne({
      where: {
        id: id,
      },
    });
    res.render("singleCourse", {
      navStatusHome: "",
      navStatusAbout: "",
      navStatusCourses: "active",
      navStatusEnrolledCourses: "",
      user: user,
      course: course,
      courses: courses,
    });
  } else {
    res.render("singleCourse", {
      navStatusHome: "",
      navStatusAbout: "",
      navStatusCourses: "active",
      navStatusEnroledCourses: "",
      course: course,
      courses: courses,
    });
  }
});

router.get("/enrolled-courses", userAuth, async (req, res) => {
  const id = req.id;
  if (id) {
    const user = await User.findByPk(id, {
      include: {
        model: Course,
        as: "enrolledCourses",
      },
    });
    res.render("userCourses", {
      user: user,
      navStatusHome: "",
      navStatusAbout: "",
      navStatusCourses: "",
      navStatusEnrolledCourses: "active"
    });
  }
});

//--------------------------------------------------------------------------------------//

//ENROLLMENT API

router.post("/course/:num", userAuth, async (req, res) => {
  const user_id = req.id;
  const course_id = req.params.num;
  const courses = await Course.findAll({
    order: Sequelize.literal("id DESC"),
    limit: 3,
  });
  const course = await Course.findOne({
    where: {
      id: course_id,
    },
  });
  if (user_id) {
    const user = await User.findOne({
      where: {
        id: user_id,
      },
    });
    let price = Number(course.price);
    try {
      sfpy.payments
        .create({
          amount: price,
          currency: "PKR",
        })
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          return sfpy.checkout.create({
            tracker: data.data.token,
            orderId: `${user.id}${course.id}`,
            source: "custom",
            cancelUrl: `http://localhost:3000`,
            redirectUrl: `http://localhost:3000/courses/course/${user.id}/${course.id}/verify-payment`,
          });
        })
        .then((url) => {
          res.redirect(url);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.render("singleCourse", {
      course: course,
      courses: courses,
      errorMsg: "You Must Be Logged In To Get Enrolled",
      navStatusHome: "",
      navStatusAbout: "",
      navStatusCourses: "active",
      navStatusEnrolledCourses: "",
    });
  }
});

//--------------------------------------------------//
//Payment Verification

router.post("/course/:user_id/:course_id/verify-payment", async (req, res) => {
  const user_id = req.params.user_id;
  const course_id = req.params.course_id;
  const data = req.body;
  console.log(data);
  processPayment(data);

  if (processPayment) {
    try {
      let enrolled_courses = new Enrolled_Courses({
        UserId: user_id,
        CourseId: course_id,
      });
      enrolled_courses = await enrolled_courses.save();
      if (enrolled_courses) {
        res.redirect("/courses/enrolled-courses?paymentMessage=success");
      } else {
        res.redirect("/courses/enrolled-courses?paymentMessage=failure");
      }
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  } else {
    console.log("Payment Rejected");
    res.redirect("/");
  }
});

module.exports = router;
