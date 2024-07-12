import { Router } from "express";

const router = Router();

router.get("/signup", (req, res, next) => {
  try {
    res.render("signup");
  } catch (e) {
    next(e);
  }
});

export default router;
