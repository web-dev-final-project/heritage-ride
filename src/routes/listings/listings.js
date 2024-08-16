import { getAll, getListingById } from "../../data/listings.js";
import { getCarById } from "../../data/cars.js";
import { createListing } from "../../data/listings.js";
import { ValidationException } from "../../utils/exceptions.js";
import auth, { authSafe } from "../../middleware/auth.js";
import Validator from "../../utils/validator.js";
import { Router } from "express";
import { HttpResponse, HttpStatus } from "../../utils/class.js";
import Stripe from "stripe";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_KEY);

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

router.post("/checkout", auth, async (req, res, next) => {
  try {
    const validListing = Validator.validateId(req.body.listingId);
    const validUser = Validator.validateId(req.user._id);
    const listing = await getListingById(validListing);
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              images: [listing.image],
              name: listing.title,
            },
            unit_amount: listing.price * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        buyerId: validUser,
        sellerId: listing.sellerId.toString(),
        listingId: validListing,
      },
      mode: "payment",
      success_url: `${baseUrl}/listings/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/listings/order/${validListing}`,
    });
    res.status(200).send(new HttpResponse(session.url, HttpStatus.SUCCESS));
  } catch (e) {
    next(e);
  }
});

export default router;
