require("dotenv").config();

module.exports = {
  port: Number(process.env.PORT) || 3000,
  appName: process.env.APP_NAME || "Partner Integration Platform",
  environment: process.env.NODE_ENV || "development"
};