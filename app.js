const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || 3000;

//Middlewares
dotenv.config({ path: "config/config.env" });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("tiny"));
app.use(cookieParser());

//View Engine
app.set("view engine", "ejs");

//Public Folder
app.use(express.static("public"));

//DB Connection
require("./utils/database");

//Routes
const homeRoute = require("./routes/home");
const aboutRoute = require("./routes/about");
const coursesRoute = require("./routes/courses");
const userAccountRoute = require("./routes/userAccount");
const registerRoute = require("./routes/register");
const dashboardRoute = require("./routes/dashboard");

app.use("/", homeRoute);
app.use("/about", aboutRoute);
app.use("/courses", coursesRoute);
app.use("/user-account", userAccountRoute);
app.use("/register", registerRoute);
app.use("/dashboard", dashboardRoute);

//Server
try {
  server.listen(port, () => {
    console.log(
      `Application Is Running On Port ${port} In ${process.env.NODE_ENV} Mode`
    );
  });
} catch (err) {
  console.log("An Error Occured While Starting The Server");
  console.log(err);
}
