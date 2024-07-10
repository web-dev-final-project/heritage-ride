import "dotenv/config";
import logger from "./utils/logger.js";
import express from "express";
import { startLog, endLog } from "./utils/logger.js";
import error from "./middleware/error.js";
import "./utils/extend.js";
import initRouter from "./routes/index.js";

const app = express();
const port = process.env.PORT || 4000;

app.listen(port, async () => {
  logger.info(`Server has started on port ${port}...`);
});
app.use(express.json());
app.use(startLog);
initRouter(app);
app.get("/health", (req, res) => {
  res.send("healthy");
});
app.use(error);
