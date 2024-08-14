import { Router } from "express";
import Validator from "../../utils/validator.js";
import * as users from "../../data/users.js";
import {
  AuthenticationException,
  InvalidInputException,
  NotFoundException,
} from "../../utils/exceptions.js";
import auth, { authSafe } from "../../middleware/auth.js";
import { getApiRoutes } from "../index.js";
import logger from "../../utils/logger.js";
import { cloudinary } from "../../utils/class.js";
import { getListingByUser } from "../../data/listings.js";

const router = Router();

router.get("/", auth, async (req, res, next) => {
  logger.info(`new request: (${req.method}) to ${req.url}.`);
  try {
    const id = Validator.validateId(req.user._id);
    const user = await users.findUser(id);
    if (!user) throw new AuthenticationException(`user not found`);
    res.render("userProfile", { user: req.user });
  } catch (e) {
    next(e);
  }
});

router.get("/login", (req, res, next) => {
  try {
    res.render("login", {
      url: getApiRoutes(req).userRoute + "/login",
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
});

<<<<<<< HEAD

router.get("/experts", (req, res, next) => {
  try {
    res.render("experts");
  } catch (e) {
    next(e);
  }
});

router.get("/experts/all", async (req, res, next) => {
  try {
    const experts = await users.getAllExperts();
    res.render("experts", { experts });
  } catch (e) {
    next(e);
  }
});

router.get("/experts/search", async (req, res, next) => {
  
    try {
      const name = req.query.name;
      if (!name || !name.trim()) {
        logger.warn("Invalid search input: Name is not valid.");
        res.render("experts", { error: "Name is not valid" });
        return;
      }

      let name1 =Validator.nullcheck(name);
      name1=name1.checkString();
      const experts = await users.searchExpertsByName(name1);
      res.render("experts", { experts });
    } catch (e) {
      next(e);
    
    }
=======
router.get("/signup", authSafe, (req, res, next) => {
  try {
    if (req.user) {
      res.redirect(`${req.protocol}://${req.get("host")}`);
    } else {
      res.render("signup", {
        signUpUrl: getApiRoutes(req).userRoute + "/signup",
        cloudinary: cloudinary,
      });
    }
  } catch (e) {
    next(e);
  }
});

router.get("/edit", auth, (req, res, next) => {
  res.render("signup", {
    signUpUrl: getApiRoutes(req).userRoute + "/edit",
    cloudinary: cloudinary,
    user: req.user,
  });
});

router.get("/logout", authSafe, (req, res, next) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.redirect(`${req.protocol}://${req.get("host")}`);
});

router.get("/seller", auth, async (req, res) => {
  const isSeller = req.user.role.includes("seller");
  const listings = await getListingByUser(req.user._id);
  res.render("seller.handlebars", {
    user: req.user,
    listings: listings,
    isSeller,
  });
>>>>>>> 2c6a561f49812957dfa89abf43e6b6bd8ac694e9
});

export default router;
