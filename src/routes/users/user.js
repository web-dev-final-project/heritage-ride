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
router.post("/login", async (req, res, next) => {
  try {
    let user = req.body;
    user = Validator.validateUser(user);
    const resp = await users.createUser(user);
    res.status(201).send(res);
  } catch (e) {
    next(e);
  }
});

  router.get("/experts", async (req, res, next) => {
    try {
      const experts = await users.getAllExperts();
      res.status(200).send(experts);
    } catch (e) {
      next(e);
    }
  });
  
  router.get("/experts/:userId", async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const expert = await users.getExpertById(userId);
      res.status(200).send(expert);
    } catch (e) {
      next(e);
    }
  

});

export default router;
