import { Router } from "express";
import { getTransactionByListingId } from "../../data/transaction.js";
import auth from "../../middleware/auth.js";
import { getListingByUser } from "../../data/listings.js";
import Validator from "../../utils/validator.js";

const router = Router();

router.get("/", auth, async (req, res) => {
  const isSeller = req.user.role.includes("seller");
  const listings = await getListingByUser(req.user._id);
  res.render("seller.handlebars", {
    user: req.user,
    listings: listings,
    isSeller,
  });
});

router.get("/transaction/:id", auth, async (req, res, next) => {
  try {
    const validId = Validator.validateId(req.params.id);
    const transaction = await getTransactionByListingId(validId);
    res.render("transaction", { user: req.user, transaction: transaction });
  } catch (e) {
    next(e);
  }
});

export default router;
