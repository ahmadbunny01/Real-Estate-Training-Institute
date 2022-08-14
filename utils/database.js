const { Sequelize } = require("sequelize");

const db = new Sequelize("sql8512791", "sql8512791", "5eex3MFuSw", {
  host: "sql8.freemysqlhosting.net",
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
