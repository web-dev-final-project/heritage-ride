import { authSafe } from "../middleware/auth.js";
import userAPI from "./users/user.js";
import listingsAPI from "./listings/listings.js";
import userView from "./users/userView.js";
import expertsAPI from "./experts/expert.js";
import expertsView from "./experts/expertView.js";

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
  app.use("/expert", expertsView);
};

const apiRouter = (app) => {
  // add your backends routes here, prefix with /api/
  app.use("/api/listings", listingsAPI)
  app.use("/api/user", userAPI);
  app.use("/api/expert", expertsAPI);
};

const getApiRoutes = (req) => {
  const protocol = req.protocol;
  const host = req.get("host");
  const serverUrl = `${protocol}://${host}`;
  return {
    home: `${serverUrl}`,
    userRoute: `${serverUrl}/api/user`,
    userLogin: `${serverUrl}/user/login`,
    userSignup: `${serverUrl}/user/signup`,
    userExperts: `${serverUrl}/user/experts`,
  };
};

export { apiRouter, uiRouter, getApiRoutes };
