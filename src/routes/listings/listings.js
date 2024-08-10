import { Router } from "express";
import { getAll, getListingById } from "../../data/listings.js";
import { NotFoundException } from "../../utils/exceptions.js";
import { authSafe } from "../../middleware/auth.js";
import Validator from "../../utils/validator.js";
import { getCarById } from "../../data/cars.js";

const router = Router();

router.get('/search', authSafe, async (req, res, next) => { // car listings search, displays cars
    const query = req.query
    // Error check
    const errors = Validator.validateQuery(query);
    if (errors.length > 0) {
        return res.status(400).render('carSearch', {
            error: 'Invalid search criteria: ' + errors.join(', '),
            results: [] // Ensure no results are shown if there's an error
        });
    }

    try {
      const result = await getAll(query);
      if (!result) throw new NotFoundException(`listing not found`);
      res.render('carSearch', {results: result, user})
    } catch (e) {
      next(e)
    }
  });

  router.get('/search/:listingId', async (req, res, next) => {
    const listingId = req.params.listingId;
    console.log(listingId)
    try {
        // Fetch the listing details from the Listings collection
        const listingDetails = await getListingById(listingId);
        //console.log(listingDetails)
        // Fetch the listing details from the Listings collection using the carId
        const carDetails = await getCarById(listingDetails.itemId.toString());
        //console.log(carDetails)

        // toDo: have to extract user info by userId

        if (!carDetails || !listingDetails) {
            return res.status(404).render('404', { message: 'Car or listing not found' });
        }

        // Render the details page with car and listing information
        res.render('listingDetails', {
            car: carDetails,
            listing: listingDetails
        });
    } 
    catch (e) {
      next(e);
    }
});

  export default router;import { createListing } from "../../data/listings.js";
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

    if (!req.user.role.includes("seller"))
      throw new ValidationException("User is not a seller");

    const listing = await createListing(req.user._id, validListing);
    res.status(201).send(new HttpResponse(listing, HttpStatus.SUCCESS));
  } catch (e) {
    next(e);
  }
});

export default router;
