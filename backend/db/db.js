"use strict";
const mongoose = require("mongoose");
/**************************connection logic to mongodb atlas and securing by an environment variable*************** */
mongoose
  .connect(
    process.env.APP_CONNECT_MONGOD,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Successful connection to MongoDB !"))
  .catch(() => console.log("Connection to MongoDB failed !"));






