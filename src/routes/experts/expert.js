import { Router } from "express";
import * as expertDb from "../../data/experts.js";
import Validator from "../../utils/validator.js";
import auth from "../../middleware/auth.js";
import { HttpResponse, HttpStatus } from "../../utils/class.js";
import { ValidationException } from "../../utils/exceptions.js";
import { addRequest, addReview } from "../../data/requests.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const experts = await expertDb.getAllExperts();
    res.status(200).send(new HttpResponse(experts, HttpStatus.SUCCESS));
  } catch (e) {
    next(e);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const expr = req.body;
    const validExpr = Validator.validateExpert(expr);
    const ex = await expertDb.createExpert(validExpr);
    const role = req.user.role;
    role.push("expert");
    console.log(req.user, role);
    req.refreshToken({ ...req.user, role });
    res.status(201).send(new HttpResponse(ex, HttpStatus.SUCCESS));
  } catch (e) {
    next(e);
  }
});

router.put("/", auth, async (req, res, next) => {
  try {
    const expr = req.body;
    const validExpr = Validator.validateExpert(expr);
    const ex = await expertDb.updateExpert(validExpr, req.user._id);
    res.status(201).send(new HttpResponse(ex, HttpStatus.SUCCESS));
  } catch (e) {
    next(e);
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let Valid_id = Validator.validateId(userId);
    const expert = await expertDb.getExpertById(Valid_id);
    res.status(200).send(new HttpResponse(expert, HttpStatus.SUCCESS));
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
    res.status(200).send(new HttpResponse(experts, HttpStatus.SUCCESS));
  } catch (e) {
    next(e);
  }
});

router.post("/hire", auth, async (req, res, next) => {
  try {
    const expertId = Validator.validateId(req.body.expertId);
    const listId = Validator.validateId(req.body.listingId);
    if (expertId === req.user._id) {
      throw new ValidationException(
        "user can't hire themselve for inspection."
      );
    }
    const expert = await expertDb.getExpertById(expertId);
    await addRequest(expert, listId);
    res
      .status(200)
      .send(new HttpResponse("Expert reserved", HttpStatus.SUCCESS));
  } catch (e) {
    next(e);
  }
});

router.post("/addReview", auth, async (req, res, next) => {
  try {
    const validExpertId = Validator.validateId(req.body.expertId);
    const validIListingId = Validator.validateId(req.body.listingId);
    const validReview = Validator.validateReview(req.body);
    await addReview(validExpertId, validReview, validIListingId);
    res.status(200).send(new HttpResponse("success", HttpStatus.SUCCESS));
  } catch (e) {
    next(e);
  }
});

export default router;
