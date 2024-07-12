import "dotenv/config";
import logger from "./utils/logger.js";
import express from "express";
import { startLog, endLog } from "./utils/logger.js";
import error from "./middleware/error.js";
import "./utils/extend.js";
import { apiRouter, uiRouter } from "./routes/index.js";
import path from "path";
import { handlebarsInstance } from "./settings.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.static(path.join(path.resolve(), "src/public")));
app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(path.resolve(), "src/views"));

app.use(express.static(path.join(path.resolve(), "src/public")));
app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(path.resolve(), "src/views"));

app.listen(port, async () => {
  logger.info(`Server has started on port ${port}...`);
});

app.use(express.json());
app.use(startLog);

uiRouter(app);
apiRouter(app);

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/health", (req, res) => {
  res.send("healthy");
});
app.get("/*", (req, res) => {
  res.render("404");
});
app.use(error);
