"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "secret-inspire";

const PORT = +process.env.PORT || 3001;

console.log("Jobly Config:");
console.log("SECRET_KEY:", SECRET_KEY);
console.log("PORT:", PORT.toString());

module.exports = {
  SECRET_KEY,
  PORT,
};
