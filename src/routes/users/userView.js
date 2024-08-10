import { Router } from "express";
import Validator from "../../utils/validator.js";
import * as users from "../../data/users.js";
import {
  AuthenticationException,
  InvalidInputException,
  NotFoundException,
} from "../../utils/exceptions.js";
import auth, { authSafe } from "../../middleware/auth.js";
import { getApiRoutes } from "../index.js";
import logger from "../../utils/logger.js";
import { cloudinary } from "../../utils/class.js";

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

router.get("/edit", auth, (req, res, next) => {
  res.render("signup", {
    signUpUrl: getApiRoutes(req).userRoute + "/edit",
    cloudinary: cloudinary,
    user: req.user,
  });
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

router.get("/seller", auth, (req, res) => {
  res.render("seller.handlebars", { user: req.user });
});

export default router;
