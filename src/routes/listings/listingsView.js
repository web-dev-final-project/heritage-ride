import { Router } from "express";
import {
  getAll,
  getListingById,
  updateListingById,
} from "../../data/listings.js";
import {
  InvalidInputException,
  NotFoundException,
  PageNotFoundException,
  ValidationException,
} from "../../utils/exceptions.js";
import auth, { authSafe } from "../../middleware/auth.js";
import Validator from "../../utils/validator.js";
import { getCarById, getCars } from "../../data/cars.js";
import { findUser } from "../../data/users.js";
import Stripe from "stripe";
import { createTransaction } from "../../data/transaction.js";
import { cloudinary } from "../../utils/class.js";
import { getPartById, getParts } from "../../data/parts.js";

const stripe = new Stripe(process.env.STRIPE_KEY);
const router = Router();

router.get("/search", authSafe, async (req, res, next) => {
  // car listings search, displays cars
  try {
    const valQuery = Validator.validateQuery(req.query);
    const result = await getAll(valQuery);
    res.render("carSearch", {
      results: result.filter((li) => li.status !== "delisted"),
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

router.get("/edit", auth, async (req, res, next) => {
  try {
    const { type, id } = req.query;
    if (type !== "car" && type !== "part") {
      throw new PageNotFoundException();
    }
    const validId = Validator.validateId(id);
    const listing = await getListingById(validId);
    let cars = await getCars();
    if (type !== "car") cars = await getParts();

    return res.render("addCarListing", {
      listing,
      cars: cars,
      itemType: type,
      user: req.user,
      cloudinary: cloudinary,
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
    let cars = await getCars();
    if (itemType !== "car") cars = await getParts();
    return res.render("addCarListing", {
      cars: cars,
      itemType: itemType,
      user: req.user,
      cloudinary: cloudinary,
      listing: null,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/part/:listingId", authSafe, async (req, res, next) => {
  const listingId = req.params.listingId;
  try {
    const listingDetails = await getListingById(listingId);
    const partDetails = await getPartById(listingDetails.itemId.toString());
    const sellerDetails = await findUser(listingDetails.sellerId.toString());

    if (sellerDetails && sellerDetails.password) {
      delete sellerDetails.password;
    }
    if (!partDetails || !listingDetails) {
      return res
        .status(404)
        .render("404", { message: "Car or listing not found", user: req.user });
    }
    res.render("listingDetails", {
      part: partDetails,
      listing: listingDetails,
      user: req.user,
      seller: sellerDetails,
      type: "part",
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
      delete sellerDetails.password;
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
      type: "car",
    });
  } catch (e) {
    next(e);
  }
});

export default router;
