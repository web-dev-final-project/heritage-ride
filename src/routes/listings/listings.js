import { getAll, getListingById } from "../../data/listings.js";
import { getCarById } from "../../data/cars.js";
import { createListing } from "../../data/listings.js";
import { DataBaseException, ValidationException } from "../../utils/exceptions.js";
import auth, { authSafe } from "../../middleware/auth.js";
import Validator from "../../utils/validator.js";
import { Router } from "express";
import { HttpResponse, HttpStatus } from "../../utils/class.js";
import { addRole, findUser } from "../../data/users.js";

const router = Router();

router.post("/create", auth, async (req, res, next) => {
  try {
    // check inputs
    req.body.price = Number(req.body.price); // will convert to number if price is a number, otherwise NaN
    if (isNaN(req.body.price)) {
      throw new ValidationException("Price must be a valid number");
    }
    const validListing = Validator.validateListing(req.body);

    const listing = await createListing(req.user._id, validListing);

    if (!req.user.role.includes("seller")){
      // Add 'seller' role to the user in the db
      const result = await addRole(req.user._id, "seller");
      // Update req.user with the new role so it is recognized by other routes
      req.user = await findUser(req.user._id);
      if (result.modifiedCount === 0) {
        throw new DataBaseException("Failed to add role");
      }
    }
    // change error handling since theres 2 different exception types?

    //res.status(201).send(new HttpResponse(listing, HttpStatus.SUCCESS));
    res.redirect("/user/seller");
  } catch (e) {
    next(e);
  }
});

export default router;
