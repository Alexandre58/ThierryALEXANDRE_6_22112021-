"use strict";
/*****************import express**************** */
const express = require("express");
/*****************file.env********************* */
require("dotenv").config();
/***********connection database file db.js*******/
const mongoose = require("mongoose");
/*********** protection of HTTP headers.cache X-powerded-bytête here (XSS)*********/
const helmet = require("helmet");
const cors = require('cors');
/***********access path images*******************/
const path = require("path");
/********import morgan (logger http)*************/
const morgan = require("morgan");
/***************import routes********************/
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
/*****************Express********************* **/
const app = express();
/**************************log HTTP requests and errors terminal(dev)***************************** */
app.use(morgan("dev"));
app.use(cors())
/*management of the POST request coming from the front-end application, extraction of the JSON body*/
app.use(express.json());
/**************************connection logic to mongodb atlas and securing by an environment variable*************** */
mongoose
  .connect(
    process.env.APP_CONNECT_MONGOD,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Successful connection to MongoDB !"))
  .catch(() => console.log("Connection to MongoDB failed !"));
/************************CORS cross-origin ressourse sharing ***************************************/
//avoid related errors when the client does not share servers from the same origin
//configure headers specific to the responce object
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
/************************helmet http en-têtes protection*******************************************/
app.use(helmet());
/******************************access path image file***********************/
app.use("/images", express.static(path.join(__dirname, "images")));
/**********************************router product.js**************************/
app.use("/api/sauces", productRoutes);
/**********************************authentication routes*************************/
app.use("/api/auth", userRoutes);

module.exports = app;
