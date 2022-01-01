"use strict";
const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

/****************creation of the User = unique schema: true prevents connections with the same address*******/
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
/***************methode plugin validation sécurité*******************************************************/
userSchema.plugin(uniqueValidator);


module.exports = mongoose.model("User", userSchema);