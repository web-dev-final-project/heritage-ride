import { ObjectId } from "mongodb";
import {
  InvalidInputException,
  InvalidValueException,
  NotFoundException,
  ValidationException,
} from "./exceptions.js";
import { Role } from "./extend.js";
import xss from "xss";

class Validator {
  static validateQuery(query) {
    const {
      type = "cars",
      make = "",
      model = "",
      category = "",
      car = "",
      part = "",
      partCategory = "",
    } = query;

    if (typeof type !== "string" || (type !== "cars" && type !== "parts")) {
      throw new NotFoundException(
        "Invalid query type, only allowed cars or parts"
      );
    }
    if (type === "cars") {
      if (make && typeof make !== "string") {
        throw new NotFoundException("Make must be a string");
      }
      if (model && typeof model !== "string") {
        throw new NotFoundException("Model must be a string");
      }
      if (make && typeof category !== "string") {
        throw new NotFoundException("Make must be a string");
      }
    } else if (type === "parts") {
      if (model && typeof car !== "string") {
        throw new NotFoundException("Car or model must be a string");
      }
      if (model && typeof part !== "string") {
        throw new NotFoundException("part must be a string");
      }
      if (model && typeof partCategory !== "string") {
        throw new NotFoundException("tag must be a string");
      }
    }
    return {
      type: xss(type),
      make: xss(make),
      model: xss(model),
      category: xss(category),
      car: xss(car),
      part: xss(part),
      partCategory: xss(partCategory),
    };
  }

  static validateImageURL(image) {
    if (
      typeof image !== "string" ||
      image.trim() === "" ||
      !/^https?:\/\/.+/.test(image)
    ) {
      throw new InvalidInputException("Image URL must be a valid URL.");
    }
    return xss(image);
  }

  static validateCreateListing(obj) {
    if (!obj || typeof obj !== "object") {
      throw new InvalidInputException("Provided listing must be an object.");
    }
    let listing = { ...obj };
    listing.title = xss(this.nullcheck(obj.title).checkString(5, 50, "title"));
    listing.description = xss(
      this.nullcheck(obj.description).checkString(20, 500, "description")
    );
    listing.price = this.nullcheck(obj.price).checkNumber(
      0,
      1000000000,
      "price"
    );
    if (obj.itemType !== "car" && obj.itemType !== "part") {
      throw new Error("Invalid item type");
    }
    listing.itemType = xss(this.nullcheck(obj.itemType));
    listing.image = xss(this.nullcheck(obj.image).checkString().checkUrl());
    return listing;
  }

  static validatePartialListing(obj) {
    if (!obj || typeof obj !== "object") {
      throw new InvalidInputException(
        "Listing object must be provided and must be an object."
      );
    }
    let listing = {};
    if (obj.title) {
      listing.title = xss(obj.title.checkString(5, 50, "title"));
    }
    if (obj.description) {
      listing.description = xss(
        obj.description.checkString(20, 500, "description")
      );
    }
    if (obj.price) {
      listing.price = obj.price.checkNumber(0, 1000000000, "price");
    }
    if (obj.status) {
      const stats = ["open", "reserved", "sold", "delisted"];
      let cat = obj.status.trim().toLowerCase();
      listing.status = (() => {
        if (stats.includes(cat)) return cat;
        else
          throw new InvalidInputException(
            "status must be open, reserved, sold or delisted."
          );
      })();
    }
    if (obj.itemType) {
      let cat = obj.itemType;
      listing.itemType = (() => {
        if (cat === "car" || cat === "part") return cat;
        else
          throw new InvalidInputException(
            "itemType must be either car or part."
          );
      })();
    }
    if (obj.image) {
      listing.image = xss(obj.image.checkString().checkUrl());
    }
    if (obj.gallery) {
      listing.image = obj.image.checkStringArray();
    }
    return listing;
  }

  static validateUser(obj) {
    if (!obj || obj === undefined)
      throw new InvalidInputException("Input must not be empty");
    let user = {
      ...obj,
      firstName: this.nullcheck(obj.firstName)
        .checkString(2, 20, "first name")
        .checkCharacter("first name")
        .checkSpace("first name"),
      lastName: this.nullcheck(obj.lastName)
        .checkString(2, 20, "last name")
        .checkCharacter("last name")
        .checkSpace("last name"),
      userName: this.nullcheck(obj.userName)
        .checkString(5, 20, "user name")
        .checkSpace("userName"),
      password: this.nullcheck(obj.password)
        .checkString(10, 30, "password")
        .checkSpace("password"),
      avatar: this.nullcheck(obj.avatar)
        .checkString()
        .checkUrl()
        .checkSpace("avatar"),
      email: this.nullcheck(obj.email)
        .checkString()
        .checkEmail()
        .checkSpace("avatar"),
      address: obj.address ? obj.address.checkString() : obj.address,
    };
    return user;
  }
  static validateId(id) {
    let str = this.nullcheck(id).checkString();
    if (!ObjectId.isValid(str)) {
      throw new InvalidValueException("Invalid Id.");
    }
    return str;
  }
  static validateRole(role) {
    const arr = role.checkNull().checkStringArray();
    if (arr.some((item) => !Role.containsValue(item))) {
      throw new InvalidValueException(
        "Invalid role, role must be either user, expert or seller"
      );
    }
    return arr;
  }

  // Future update
  // static validatePart(obj) {
  //   if (!obj || obj === undefined)
  //     throw new InvalidInputException("Input must not be empty");

  //   let part = {
  //     ...obj,
  //     name: Validator.nullcheck(obj.name).checkString(),
  //     price: Validator.nullcheck(obj.price).checkNumber(),
  //     manufacturer: Validator.nullcheck(obj.manufacturer).checkString(),
  //     sellerId: Validator.nullcheck(obj.sellerId).checkId(),
  //     carIds: Validator.nullcheck(obj.carIds).checkArray().checkObjectIds(),
  //   };
  //   return part;
  // }

  static nullcheck(obj) {
    if (!obj) throw new InvalidInputException("Some inputs are missing");
    return obj;
  }

  static validateExpert(obj) {
    if (!obj || obj === undefined)
      throw new InvalidInputException("Input must not be empty");
    let expert = {
      ...obj,
      userId: Validator.nullcheck(obj.userId).checkString().checkObjectId(),
      bio: xss(Validator.nullcheck(obj.bio).checkString(10, 500, "Bio")),
      skills: Validator.nullcheck(obj.skills).checkStringArray(),
      location: xss(
        Validator.nullcheck(obj.location).checkString(5, 50, "location")
      ),
      images: Validator.nullcheck(obj.images).checkStringArray(),
    };
    return expert;
  }

  static validateTransaction(obj) {
    if (!obj || obj === undefined)
      throw new InvalidInputException("Transaction must not be empty");
    let trans = {
      sellerId: this.validateId(this.nullcheck(obj.sellerId)),
      buyerId: this.validateId(this.nullcheck(obj.buyerId)),
      listingId: this.validateId(this.nullcheck(obj.listingId)),
      amount: this.nullcheck(obj.amount).checkNumber(),
      paymentStatus: this.nullcheck(obj.paymentStatus).checkString(),
      payment: this.nullcheck(obj.payment),
    };
    return trans;
  }

  static validateReview(obj) {
    if (!obj || obj === undefined)
      throw new InvalidInputException("Review must not be empty");
    let expert = {
      ...obj,
      condition: (() => {
        const state = Validator.nullcheck(obj.condition)
          .checkString()
          .toLowerCase();
        if (!["great", "good", "fair", "need work"].includes(state)) {
          throw new ValidationException("invalid condition");
        }
        return state;
      })(),
      estimateValue: Validator.nullcheck(obj.estimateValue).checkNumber(
        1,
        100000000,
        "Estimated value"
      ),
      reviewMessage: Validator.nullcheck(obj.reviewMessage).checkString(
        10,
        80,
        "Summary"
      ),
      notes: Validator.nullcheck(obj.notes).checkString(10, 500, "Details"),
    };
    return expert;
  }
}

export default Validator;
