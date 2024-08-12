import { Router } from "express";
import { getAll, getListingById } from "../../data/listings.js";
import { InvalidInputException, NotFoundException, ValidationException } from "../../utils/exceptions.js";
import auth, { authSafe } from "../../middleware/auth.js";
import Validator from "../../utils/validator.js";
import { getCarById, getCars } from "../../data/cars.js";
import { findUser } from "../../data/users.js";

import { HttpResponse, HttpStatus } from "../../utils/class.js"; // delete
import { createListing } from "../../data/listings.js"; // delete

const router = Router();

router.get("/search", authSafe, async (req, res, next) => { // car listings search, displays cars
  const query = req.query;
  // Error check
  const errors = Validator.validateQuery(query);
  if (errors.length > 0) {
    return res.status(400).render("carSearch", {
      error: "Invalid search criteria: " + errors.join(", "),
      results: [], // Ensure no results are shown if there's an error
      user: req.user,
    });
  }

  try {
    const result = await getAll(query);
    if (!result) throw new NotFoundException(`listing not found`);
    return res.render("carSearch", { results: result, user: req.user });
  } catch (e) {
    next(e);
  }
});

// create listing
router.get('/create', authSafe, async (req, res, next) => { // use auth right?
  // check item type (car or part)
  const itemType = req.query.itemtype; // from the query parameters in addListing.handlebars
  if (!itemType || (itemType !== 'car' && itemType !== 'part')) { 
    throw new InvalidInputException('Invalid item type')
  }

  try {
    const cars = await getCars();
    return res.render("addCarListing", { cars: cars, itemType: itemType, user: req.user });
  } 
  catch (e) {
    next(e)
  }
});
// delete below route and move it to listings.js
router.post("/create", auth, async (req, res, next) => {
  try {
    req.body.price = Number(req.body.price); // will convert to number if price is a number, otherwise NaN
    if (isNaN(req.body.price)) {
      throw new ValidationException("Price must be a valid number");
    }
    const validListing = Validator.validateListing(req.body);

    // if (!req.user.role.includes("seller"))
    //   throw new ValidationException("User is not a seller");
    // what if it is their first time posting a car^?

    const listing = await createListing(req.user._id, validListing);
    res.status(201).send(new HttpResponse(listing, HttpStatus.SUCCESS));
  } catch (e) {
    next(e);
  }
});

router.get("/:listingId", authSafe, async (req, res, next) => {
  const listingId = req.params.listingId;
  try {
    const listingDetails = await getListingById(listingId);
    const carDetails = await getCarById(listingDetails.itemId.toString());
    const sellerDetails = await findUser(listingDetails.sellerId.toString());

    if (sellerDetails && sellerDetails.password) {
      delete sellerDetails.password; // delete password field from current object
    }

    if (!carDetails || !listingDetails) {
      return res
        .status(404)
        .render("404", { message: "Car or listing not found", user: req.user });
    }

    res.render("listingDetails", {
      car: carDetails,
      listing: listingDetails,
      user: req.user,
      seller: sellerDetails,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
