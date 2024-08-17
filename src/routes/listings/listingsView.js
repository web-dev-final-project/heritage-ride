import { Router } from "express";
import {
  getAll,
  getListingById,
  updateListingById,
} from "../../data/listings.js";
import {
  InvalidInputException,
  NotFoundException,
  ValidationException,
} from "../../utils/exceptions.js";
import auth, { authSafe } from "../../middleware/auth.js";
import Validator from "../../utils/validator.js";
import { getCarById, getCars } from "../../data/cars.js";
import { findUser } from "../../data/users.js";
import Stripe from "stripe";
import { createTransaction } from "../../data/transaction.js";
import { cloudinary } from "../../utils/class.js";

const stripe = new Stripe(process.env.STRIPE_KEY);
const router = Router();

router.get("/search", authSafe, async (req, res, next) => {
  // car listings search, displays cars
  try {
    // Error check
    const valQuery = Validator.validateQuery(req.query);

    const result = await getAll(valQuery);
    if (!result) throw new NotFoundException(`listing not found`);
    res.render("carSearch", {
      results: result,
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/order/success", auth, async (req, res, next) => {
  try {
    const sessionId = req.query.session_id.checkString();
    const session = await stripe.checkout.sessions.retrieve(
      sessionId.valueOf()
    );
    if (session.payment_status === "paid") {
      const listingId = session.metadata.listingId;
      const list = await getListingById(listingId);
      if (list.status !== "open") {
        throw new ValidationException("Listing is not on sale");
      }
      await updateListingById(listingId, {
        status: "reserved",
      });
      const transaction = {
        listingId: listingId,
        sellerId: session.metadata.sellerId,
        buyerId: session.metadata.buyerId,
        amount: session.amount_total,
        paymentStatus: session.payment_status,
        payment: {
          sessionId: session.id,
          custom_address: {
            line1: session.customer_details.address.line1,
            line2: session.customer_details.address.line2,
            city: session.customer_details.address.city,
            country: session.customer_details.address.country,
            postal_code: session.customer_details.address.postal_code,
            state: session.customer_details.address.state,
          },
          custom_name: session.customer_details.name,
          custom_phone: session.customer_details.phone,
          custom_email: session.customer_details.email,
        },
      };
      await createTransaction(transaction);
      res.render("success", { user: req.user, isComplete: true });
    } else {
      res.render("success", { user: req.user, isComplete: false });
    }
  } catch (e) {
    next(e);
  }
});

router.get("/order/:id", auth, async (req, res, next) => {
  try {
    const listingId = req.params.id;
    const listingDetails = await getListingById(listingId);
    const sellerDetails = await findUser(listingDetails.sellerId.toString());
    res.render("order", {
      listing: listingDetails,
      user: req.user,
      seller: sellerDetails,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/create", auth, async (req, res, next) => {
  const itemType = req.query.itemtype;
  if (!itemType || (itemType !== "car" && itemType !== "part")) {
    throw new InvalidInputException("Invalid item type");
  }

  try {
    const cars = await getCars();
    return res.render("addCarListing", {
      cars: cars,
      itemType: itemType,
      user: req.user,
      cloudinary: cloudinary,
    });
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
