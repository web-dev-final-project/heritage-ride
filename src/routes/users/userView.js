import { Router } from "express";
import Validator from "../../utils/validator.js";
import * as users from "../../data/users.js";
import { NotFoundException } from "../../utils/exceptions.js";
import auth from "../../middleware/auth.js";
import { getApiRoutes } from "../index.js";
import logger from "../../utils/logger.js";

const router = Router();

router.get("/", auth, async (req, res, next) => {
  logger.info(`new request: (${req.method}) to ${req.url}.`);
  try {
    const id = Validator.validateId(req.user._id);
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


router.get("/experts", (req, res, next) => {
  try {
    res.render("experts");
  } catch (e) {
    next(e);
  }
});

router.get("/experts/all", async (req, res, next) => {
  try {
    const experts = await users.getAllExperts();
    res.render("experts", { experts });
  } catch (e) {
    next(e);
  }
});

router.get("/experts/search", async (req, res, next) => {
  try {
    const name = req.query.name;
    const experts = await users.searchExpertsByName(name);
    res.render("experts", { experts });
  } catch (e) {
    next(e);
  }
});

export default router;
