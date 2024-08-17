import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "service", datetime: new Date().toUTCString() },
  transports: [
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "./logs/combined.log" }),
  ],
});
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

const startLog = (req, res, next) => {
  if (
    req.url.includes("/api") ||
    req.url.includes("/expert") ||
    req.url.includes("/user") ||
    req.url.includes("/transaction") ||
    req.url.includes("/listings")
  )
    logger.info(`new request: (${req.method}) to ${req.url}.`);
  next();
};
const endLog = (req, res) => {
  logger.info(`response sent: ${res.statusMessage} - ${res.statusCode}.`);
};

export default logger;
export { startLog, endLog };
