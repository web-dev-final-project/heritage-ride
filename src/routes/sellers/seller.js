import { Router } from "express";
import { completeTransaction } from "../../data/transaction.js";
import auth from "../../middleware/auth.js";
import Validator from "../../utils/validator.js";
import { HttpResponse, HttpStatus } from "../../utils/class.js";

const router = Router();

router.get("/complete/:id", auth, async (req, res) => {
  const validId = await Validator.validateId(req.params.id);
  console.log(validId);
  await completeTransaction(validId);
  res.status(200).send(new HttpResponse("success", HttpStatus.SUCCESS));
});

export default router;
