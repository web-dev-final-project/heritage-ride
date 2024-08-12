import "dotenv/config";
import logger from "./utils/logger.js";
import express from "express";
import { startLog, endLog } from "./utils/logger.js";
import error from "./middleware/error.js";
import "./utils/extend.js";
import router, { apiRouter, uiRouter } from "./routes/index.js";
import path from "path";
import { handlebarsInstance } from "./settings.js";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.static(path.join(path.resolve(), "src/public")));
app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(path.resolve(), "src/views"));

app.listen(port, async () => {
  logger.info(`Server has started on port ${port}...`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// @ts-ignore
app.use(cookieParser());
app.use(startLog);

uiRouter(app);
apiRouter(app);
app.use(router);

app.use(error);
