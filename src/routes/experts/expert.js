import { Router } from "express";
import * as expertDb from "../../data/experts.js";
import Validator from "../../utils/validator.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const experts = await expertDb.getAllExperts();
    res.status(200).send(experts);
  } catch (e) {
    next(e);
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let Valid_id = Validator.validateId(userId);
    const expert = await expertDb.getExpertById(Valid_id);
    res.status(200).send(expert);
  } catch (e) {
    next(e);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const { name } = req.query;
    let name1 = Validator.nullcheck(name);
    name1 = name1.checkString();

    const experts = await expertDb.searchExpertsByName(name1);
    res.status(200).send(experts);
  } catch (e) {
    next(e);
  }
});

export default router;
