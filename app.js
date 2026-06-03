const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const config = require("./config/config");
const logger = require("./logger/logger");
const partnerRoutes = require("./routes/partnerRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");


const app = express();
app.use("/dashboard", dashboardRoutes);

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(express.json());
app.use(cors());
app.use(helmet());

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.status(200).json({
    service: config.appName,
    version: "1.0.0",
    environment: config.environment
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString()
  });
});

/*
|--------------------------------------------------------------------------
| Server Startup
|--------------------------------------------------------------------------
*/
app.use("/partners", partnerRoutes);
app.listen(config.port, () => {
  logger.info(
    {
      port: config.port
    },
    `${config.appName} started successfully`
  );
});
