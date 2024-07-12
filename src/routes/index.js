import userAPI from "./users/user.js";
import userView from "./users/userView.js";

const uiRouter = (app) => {
  app.use("/user", userView);
};

const apiRouter = (app) => {
  app.use("/api/user", userAPI);
};

const getRoutes = (req) => {
  const protocol = req.protocol;
  const host = req.get("host");
  const serverUrl = `${protocol}://${host}`;
  return {
    userLogin: `${serverUrl}/user/login`,
    userSignup: `${serverUrl}/user/signup`,
  };
};

export { apiRouter, uiRouter, getRoutes };
