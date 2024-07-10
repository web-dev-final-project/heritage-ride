import userRoute from "../routes/user.js";

const initRouter = (app) => {
  app.use("/user", userRoute);
};

export default initRouter;
