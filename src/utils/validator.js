import { ObjectId } from "mongodb";
import { InvalidInputException, InvalidValueException } from "./exceptions.js";
import { Role } from "./extend.js";

class Validator {
  static validateQuery(query) {
    const { make, model, year, category } = query;
    const errors = [];
    // Validate make
    if (make && typeof make !== "string") {
      errors.push("Make must be a string");
    }
    // Validate model
    if (model && typeof model !== "string") {
      errors.push("Model must be a string");
    }
    // Validate year
    if (year) {
      const yearNum = parseInt(year, 10);
      if (isNaN(yearNum) || yearNum > new Date().getFullYear()) {
        errors.push("Year must be a valid number less than the current year");
      }
    }
    return errors;
  }
  static validateListing(obj) {
    if (!obj || typeof obj !== "object") {
      throw new InvalidInputException(
        "Listing object must be provided and must be an object."
      );
    }
    let listing = {
      ...obj,
      itemId: this.validateId(this.nullcheck(obj.itemId)),
      title: this.nullcheck(obj.title).checkString(),
      description: this.nullcheck(obj.description).checkString(),
      price: this.nullcheck(obj.price).checkNumber(),
      category: (() => {
        let cat = this.nullcheck(obj.category)
          .checkString()
          .toLowerCase()
          .trim();
        if (cat === "car" || cat === "part") return cat;
        else
          throw new InvalidInputException(
            "Category must be either car or part."
          );
      })(),
    };
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
      listing.title = obj.title.checkString();
    }
    if (obj.description) {
      listing.description = obj.description.checkString();
    }
    if (obj.price) {
      listing.price = obj.price.checkNumber();
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
      listing.image = obj.image.checkString();
    }
    if (obj.gallery) {
      listing.image = obj.image.checkStringArray();
    }
    return listing;
  }

  static validateCar(obj) {
    return obj;
  }

  static validateUser(obj) {
    if (!obj || obj === undefined)
      throw new InvalidInputException("Input must not be empty");
    let user = {
      ...obj,
      firstName: this.nullcheck(obj.firstName).checkString(),
      lastName: this.nullcheck(obj.lastName).checkString(),
      userName: this.nullcheck(obj.userName).checkString(),
      password: this.nullcheck(obj.password).checkString(),
      avatar: this.nullcheck(obj.avatar).checkString().checkUrl(),
      email: this.nullcheck(obj.email).checkString().checkEmail(),
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

  static validatePart(obj) {
    if (!obj || obj === undefined)
      throw new InvalidInputException("Input must not be empty");

    let part = {
      ...obj,
      name: Validator.nullcheck(obj.name).checkString(),
      price: Validator.nullcheck(obj.price).checkNumber(),
      manufacturer: Validator.nullcheck(obj.manufacturer).checkString(),
      sellerId: Validator.nullcheck(obj.sellerId).checkId(),
      carIds: Validator.nullcheck(obj.carIds).checkArray().checkObjectIds(),
    };
    return part;
  }

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
      bio: Validator.nullcheck(obj.bio)
        .checkString()
        .checkStringLength(10, 500, "Bio"),
      skills: Validator.nullcheck(obj.skills).checkStringArray(),
      location: Validator.nullcheck(obj.location)
        .checkString()
        .checkStringLength(5, 50, "location"),
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
      // ...obj,
      // condition: Validator.nullcheck(obj.condition).checkString(),
      // stars: Validator.nullcheck(obj.stars).checkNumber(),
      // estimateValue: Validator.nullcheck(obj.estimateValue).checkString(),
      // reviewMessage: Validator.nullcheck(obj.reviewMessage).checkString(),
      // reviewDate: Validator.nullcheck(obj.reviewDate).checkDate()
    };
    return expert;
  }
}

export default Validator;
