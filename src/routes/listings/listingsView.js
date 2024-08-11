import { Router } from "express";
import { getAll, getListingById } from "../../data/listings.js";
import { NotFoundException } from "../../utils/exceptions.js";
import { authSafe } from "../../middleware/auth.js";
import Validator from "../../utils/validator.js";
import { getCarById } from "../../data/cars.js";
import { findUser } from "../../data/users.js";

const router = Router();

router.get("/search", authSafe, async (req, res, next) => {
  // car listings search, displays cars
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
    res.render("carSearch", { results: result, user: req.user });
  } catch (e) {
    next(e);
  }
});

router.get("/:listingId", authSafe, async (req, res, next) => {
  const listingId = req.params.listingId;
  //console.log(listingId)
  try {
    // Fetch the listing details from the Listings collection
    const listingDetails = await getListingById(listingId);
    //console.log(listingDetails)
    // Fetch the listing details from the Listings collection using the carId
    const carDetails = await getCarById(listingDetails.itemId.toString());
    //console.log(carDetails)
    const sellerDetails = await findUser(listingDetails.sellerId.toString());
    if (sellerDetails && sellerDetails.password) {
      delete sellerDetails.password; // delete password field from current object
    }

    if (!carDetails || !listingDetails) {
      return res
        .status(404)
        .render("404", { message: "Car or listing not found", user: req.user });
    }

    // Render the details page with car and listing information
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
