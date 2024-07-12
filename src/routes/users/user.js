import * as users from "../../data/users.js";
import { Router } from "express";
import Validator from "../../utils/validator.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    let user = req.body;
    user = Validator.validateUser(user);
    const resp = await users.createUser(user);
    res.status(201).send(res);
  } catch (e) {
    next(e);
  }
});

export default router;
