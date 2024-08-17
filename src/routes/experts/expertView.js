import { Router } from "express";
import Validator from "../../utils/validator.js";
import * as expert from "../../data/experts.js";
import logger from "../../utils/logger.js";
import auth, { authSafe } from "../../middleware/auth.js";
import { cloudinary } from "../../utils/class.js";
import {
  AccessException,
  ValidationException,
} from "../../utils/exceptions.js";
import { getListingByUser } from "../../data/listings.js";

const router = Router();

router.get("/", auth, async (req, res, next) => {
  try {
    if (!req.user.role.includes("expert")) {
      res.redirect("/expert/create");
    } else {
      const exp = await expert.getExpertByUserId(req.user._id);
      res.render("expert", {
        expert: { ...exp, user: req.user },
        user: req.user,
      });
    }
  } catch (e) {
    next(e);
  }
});

router.get("/all", authSafe, async (req, res, next) => {
  try {
    const experts = await expert.getAllExperts();
    res.render("experts", { experts, user: req.user });
  } catch (e) {
    next(e);
  }
});

router.get("/search", authSafe, async (req, res, next) => {
  try {
    const name = req.query.name;
    if (!name || !name.trim()) {
      logger.warn("Invalid search input: Name is not valid.");
      res.render("experts", {
        error: "Name is not valid",
        user: req.user,
      });
      return;
    }

    let name1 = Validator.nullcheck(name);
    name1 = name1.checkString();
    const experts = await expert.searchExpertsByName(name1);
    res.render("experts", { experts, user: req.user });
  } catch (e) {
    next(e);
  }
});

router.get("/create", auth, async (req, res, next) => {
  try {
    res.render("expertSignUp", {
      user: req.user,
      cloudinary: cloudinary,
      isEdit: false,
      expert: null,
      cloudinary: cloudinary,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/hire", auth, async (req, res, next) => {
  try {
    const validId = Validator.validateId(req.query.id);
    if (validId === req.user._id) {
      throw new ValidationException(
        "user can't hire themselve for inspection."
      );
    }
    const listings = await getListingByUser(req.user._id);
    res.render("hireExpert", {
      expertId: validId,
      listings: listings,
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/edit/:id", auth, async (req, res, next) => {
  try {
    const validId = Validator.validateId(req.params.id);
    const exp = await expert.getExpertById(validId);
    res.render("expertSignUp", {
      expert: exp,
      user: req.user,
      isEdit: true,
      cloudinary: cloudinary,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", auth, async (req, res, next) => {
  try {
    const validId = Validator.validateId(req.params.id);
    const exp = await expert.getExpertById(validId);
    if (exp.userId.toString() === req.user._id) {
      res.redirect("/expert");
    } else res.render("expert", { expert: exp, user: req.user });
  } catch (e) {
    next(e);
  }
});

export default router;
