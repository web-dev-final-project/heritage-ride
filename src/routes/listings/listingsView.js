import { Router } from "express";
import { getAll, getListingById } from "../../data/listings.js";
import { InvalidInputException, NotFoundException, ValidationException } from "../../utils/exceptions.js";
import auth, { authSafe } from "../../middleware/auth.js";
import Validator from "../../utils/validator.js";
import { getCarById, getCars } from "../../data/cars.js";
import { findUser } from "../../data/users.js";

const router = Router();

router.get("/search", authSafe, async (req, res, next) => { // car listings search, displays cars
  try {
    // Error check
    const valQuery = Validator.validateQuery(req.query);

    const result = await getAll(valQuery);
    if (!result) throw new NotFoundException(`listing not found`);
    return res.render("carSearch", { results: result, user: req.user });
  } catch (e) {
    next(e);
  }
});

// create listing
router.get('/create', auth, async (req, res, next) => {
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

router.get("/:listingId", authSafe, async (req, res, next) => {
  const listingId = req.params.listingId;
  try {
    const listingDetails = await getListingById(listingId);
    const carDetails = await getCarById(listingDetails.itemId.toString());
    const sellerDetails = await findUser(listingDetails.sellerId.toString());

    if (sellerDetails && sellerDetails.password) {
      delete sellerDetails.password; // delete password field from current object to protect user
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
