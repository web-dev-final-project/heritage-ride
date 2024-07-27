import userAPI from "./users/user.js";
import userView from "./users/userView.js";

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
    userLogin: `${serverUrl}/user/login`,
    userSignup: `${serverUrl}/user/signup`,
    userExperts: `${serverUrl}/user/experts`,
  };
};

export { apiRouter, uiRouter, getApiRoutes };
