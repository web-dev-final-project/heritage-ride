import { authSafe } from "../middleware/auth.js";
import userAPI from "./users/user.js";
import userView from "./users/userView.js";

import { Router } from "express";
const router = Router();

router.get("/", authSafe, (req, res) => {
  res.render("home", { user: req.user });
});
router.get("/health", (req, res) => {
  res.send("healthy");
});
router.get("/*", authSafe, (req, res) => {
  res.render("404", { user: req.user });
});

export default router;

const uiRouter = (app) => {
  // add your frontend routes here
  app.use("/user", userView);
};

const apiRouter = (app) => {
  // add your backends routes here, prefix with /api/
  app.use("/api/user", userAPI);
};

const getApiRoutes = (req) => {
  const protocol = req.protocol;
  const host = req.get("host");
  const serverUrl = `${protocol}://${host}`;
  return {
    home: `${serverUrl}`,
    userRoute: `${serverUrl}/api/user`,
  };
};

export { apiRouter, uiRouter, getApiRoutes };
