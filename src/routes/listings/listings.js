import { getAll, getListingById } from "../../data/listings.js";
import { getCarById } from "../../data/cars.js";
import { createListing } from "../../data/listings.js";
import {
  NotFoundException,
  ValidationException,
} from "../../utils/exceptions.js";
import auth, { authSafe } from "../../middleware/auth.js";
import Validator from "../../utils/validator.js";
import { Router } from "express";
import { HttpResponse, HttpStatus } from "../../utils/class.js";

const router = Router();

router.post("/create", auth, async (req, res, next) => {
  try {
    const validListing = Validator.validateListing(req.body);

    //if (!req.user.role.includes("seller"))
      //throw new ValidationException("User is not a seller");

    const listing = await createListing(req.user._id, validListing);
    res.status(201).send(new HttpResponse(listing, HttpStatus.SUCCESS));
  } catch (e) {
    next(e);
  }
});

export default router;
