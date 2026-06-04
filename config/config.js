require("dotenv").config();

module.exports = {
  port: Number(process.env.PORT) || 3000,
  appName: process.env.APP_NAME || "Partner Integration Platform",
  environment: process.env.NODE_ENV || "development",

  database: {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  name: process.env.DB_NAME || "partner_integration",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || ""
},
kafka: {
  clientId:
    process.env.KAFKA_CLIENT_ID ||
    "partner-integration-platform",

  broker:
    process.env.KAFKA_BROKER ||
    "localhost:9092"
}
};