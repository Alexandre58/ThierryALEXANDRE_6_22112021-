"use strict";
/*****************import express**************** */
const express = require("express");
/*****************file.env********************* */
require("dotenv").config();
/***********connection database file db.js*******/
const mongoose = require("./db/db.js");
/*********** protection of HTTP headers.*********/
const helmet = require("helmet");
/*** Security for multi-origin requests**********/
const cors = require("cors");
/***********access path images*******************/
const path = require("path");
/********import morgan (logger http)*************/
const morgan = require("morgan");
/***************import routes********************/
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user");
/*****************Express********************* **/
const app = express();

/************************helmet http en-têtes protection *******************************************/
app.use(helmet());
/*management of the POST request coming from the front-end application, extraction of the JSON body*/
app.use(express.json());
/**************************log HTTP requests and errors terminal(dev)***************************** */
app.use(morgan("dev"));
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
/******************************access path image file***********************/
app.use("/images", express.static(path.join(__dirname, "images")));
/**********************************router product.js**************************/
app.use("/api/sauces", productRoutes);
/**********************************authentication routes*************************/
app.use("/api/auth", userRoutes);

module.exports = app;
