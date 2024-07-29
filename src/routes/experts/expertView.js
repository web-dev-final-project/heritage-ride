import { Router } from "express";
import Validator from "../../utils/validator.js";
import * as expert from "../../data/experts.js";
import logger from "../../utils/logger.js";

const router = Router();

router.get("/", (req, res, next) => {
  try {
    res.render("experts");
  } catch (e) {
    next(e);
  }
});

router.get("/all", async (req, res, next) => {
  try {
    const experts = await expert.getAllExperts();
    res.render("experts", { experts });
  } catch (e) {
    next(e);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const name = req.query.name;
    if (!name || !name.trim()) {
      logger.warn("Invalid search input: Name is not valid.");
      res.render("experts", { error: "Name is not valid" });
      return;
    }

    let name1 = Validator.nullcheck(name);
    name1 = name1.checkString();
    const experts = await expert.searchExpertsByName(name1);
    res.render("experts", { experts });
  } catch (e) {
    next(e);
  }
});

export default router;
