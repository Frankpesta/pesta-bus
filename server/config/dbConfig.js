const mongoose = require("mongoose");

mongoose.connect(process.env.mongo_url);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connection to database successsful");
});

db.on("error", () => {
  console.log("Db connection failed");
});
