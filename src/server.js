import "dotenv/config";
import logger from "./utils/logger.js";
import express from "express";
import { startLog, endLog } from "./utils/logger.js";
import error from "./middleware/error.js";

const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => {
  logger.info(`Server has started on port ${port}...`);
});
app.use(startLog);
app.use(error);
