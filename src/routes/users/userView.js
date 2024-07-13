import { Router } from "express";
import Validator from "../../utils/validator.js";
import * as users from "../../data/users.js";
import { NotFoundException } from "../../utils/exceptions.js";
import auth from "../../middleware/auth.js";
import { getApiRoutes } from "../index.js";

const router = Router();

router.post("/", auth, async (req, res, next) => {
  try {
    let id = req.user.id;
    id = Validator.validateId(id);
    const user = await users.findUser(id);
    if (!user) throw new NotFoundException(`user not found`);
    res.render("userProfile", user);
  } catch (e) {
    next(e);
  }
});

router.get("/login", (req, res, next) => {
  try {
    res.render("login", { url: getApiRoutes(req).userRoute + "/login" });
  } catch (e) {
    next(e);
  }
});

const cloudinary = {
  cloudName: process.env.CLOUDINARY_NAME,
  presetName: process.env.CLOUDINARY_PRESET,
};

router.get("/signup", (req, res, next) => {
  try {
    res.render("signup", {
      signUpUrl: getApiRoutes(req).userRoute + "/signup",
      cloudinary: cloudinary,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
