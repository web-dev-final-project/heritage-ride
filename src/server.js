import "dotenv/config";
import logger from "./utils/logger.js";
import express from "express";
import { startLog, endLog } from "./utils/logger.js";
import error from "./middleware/error.js";
import "./utils/extend.js";
import { SuccessResponse } from "./utils/utilClass.js";

const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => {
  logger.info(`Server has started on port ${port}...`);
});
app.use(startLog);
app.get("/health", (req, res) => {
  res.send(new SuccessResponse("healthy"));
});
app.use(error);
