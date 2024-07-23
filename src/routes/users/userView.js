import { Router } from "express";
import Validator from "../../utils/validator.js";
import * as users from "../../data/users.js";
import { AuthenticationException, InvalidInputException, NotFoundException } from "../../utils/exceptions.js";
import auth, { authSafe } from "../../middleware/auth.js";
import { getApiRoutes } from "../index.js";
import logger from "../../utils/logger.js";

const router = Router();

router.get("/", auth, async (req, res, next) => {
  logger.info(`new request: (${req.method}) to ${req.url}.`);
  try {
    const id = Validator.validateId(req.user._id);
    const user = await users.findUser(id);
    if (!user) throw new AuthenticationException(`user not found`);
    res.render("userProfile", { user: req.user });
  } catch (e) {
    next(e);
  }
});

router.get("/login", (req, res, next) => {
  try {
    res.render("login", {
      url: getApiRoutes(req).userRoute + "/login",
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
});

const cloudinary = {
  cloudName: process.env.CLOUDINARY_NAME,
  presetName: process.env.CLOUDINARY_PRESET,
};

router.get("/signup", authSafe, (req, res, next) => {
  try {
    if (req.user) {
      res.redirect(`${req.protocol}://${req.get("host")}`);
    } else {
      res.render("signup", {
        signUpUrl: getApiRoutes(req).userRoute + "/signup",
        cloudinary: cloudinary,
      });
    }
  } catch (e) {
    next(e);
  }
});

router.get("/logout", authSafe, (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.redirect(`${req.protocol}://${req.get("host")}`);
});

export default router;
