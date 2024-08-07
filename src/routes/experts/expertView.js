import { Router } from "express";
import Validator from "../../utils/validator.js";
import * as expert from "../../data/experts.js";
import logger from "../../utils/logger.js";
import auth, { authSafe } from "../../middleware/auth.js";

const router = Router();

router.get("/", authSafe, (req, res, next) => {
  try {
    res.render("experts", { user: req.user });
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

export default router;
