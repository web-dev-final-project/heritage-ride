import {
  delistListing,
  getAll,
  getListingById,
  updateListingById,
} from "../../data/listings.js";
import { getCarById } from "../../data/cars.js";
import { createListing } from "../../data/listings.js";
import {
  DataBaseException,
  ValidationException,
} from "../../utils/exceptions.js";
import auth, { authSafe } from "../../middleware/auth.js";
import Validator from "../../utils/validator.js";
import { Router } from "express";
import { HttpResponse, HttpStatus } from "../../utils/class.js";
import Stripe from "stripe";
import { addRole, findUser } from "../../data/users.js";
import { generateToken } from "../../utils/auth.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_KEY);

router.post("/create", auth, async (req, res, next) => {
  try {
    req.body.price = Number(req.body.price); // will convert to number if price is a number, otherwise NaN
    if (isNaN(req.body.price)) {
      throw new ValidationException("Price must be a valid number");
    }
    const validListing = Validator.validateCreateListing(req.body);

    const listing = await createListing(req.user._id, validListing);

    if (!req.user.role.includes("seller")) {
      const result = await addRole(req.user._id, "seller");
      if (result.modifiedCount === 0) {
        throw new DataBaseException("Failed to add role");
      }
      // Update req.user with the new role so it is recognized by other routes
      req.user = await findUser(req.user._id);
      const token = generateToken(req.user);
      res.cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
    }
    res.status(201).send(new HttpResponse(listing, HttpStatus.SUCCESS));
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const validId = Validator.validateId(req.params.id);
    await delistListing(validId);
    res.status(200).send(new HttpResponse("success", HttpStatus.SUCCESS));
  } catch (e) {
    next(e);
  }
});

router.put("/edit", auth, async (req, res, next) => {
  try {
    req.body.price = Number(req.body.price);
    if (isNaN(req.body.price)) {
      throw new ValidationException("Price must be a valid number");
    }
    const validId = Validator.validateId(req.body.listingId);
    const validListing = Validator.validateCreateListing(req.body);
    await updateListingById(validId, validListing);
    res.status(200).send(new HttpResponse("success", HttpStatus.SUCCESS));
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
