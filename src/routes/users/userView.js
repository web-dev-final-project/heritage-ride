import { Router } from "express";
import * as users from "../../data/users.js";

const router = Router();

router.get("/signup", (req, res, next) => {
  try {
    res.render("signup");
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
