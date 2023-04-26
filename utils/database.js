const { Sequelize } = require("sequelize");

const db = new Sequelize("prei", "root", "", {
  host: "127.0.0.1",
  port: 3306,
  dialect: "mysql",
});

db.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

db.sync()
  .then(() => {
    console.log("Database Models Synced");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = db;
