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
      else {
        query.year = yearNum
      }
    }
    if (errors.length > 0) {
      throw new InvalidInputException(errors);
    }
    else {
      return query
    }
  }

  static validateImageURL(url) {
    if (!url || typeof url !== "string") {
      throw new InvalidInputException("Provided URL must be a string.");
    }
    const pattern = new RegExp('^https?:\\/\\/.+\\.(png|jpg|jpeg|bmp|gif|webp)(\\?.*)?$', 'i');
    if (pattern.test(url)) {
        return url
    } else {
        throw new InvalidInputException("Invalid image URL format.");
    }
  }

  static validateListing(obj) {
    if (!obj || typeof obj !== "object") {
      throw new InvalidInputException(
        "Provided listing must be an object."
      );
    }
    let valImage = ""
    if (obj.image) {
      valImage = Validator.validateImageURL(obj.image)
    }
    let listingInfo = {
      ...obj,
      // other fields were unecessary since user will only enter price and image url
      price: this.nullcheck(obj.price).checkNumber(), 
      image: valImage,
      // to Add?: verify car exists in db
      itemType: this.nullcheck(obj.itemType)
    };
    return listingInfo;
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
      bio: Validator.nullcheck(obj.bio).checkString(),
      skills: Validator.nullcheck(obj.skills).checkStringArray(),
      location: Validator.nullcheck(obj.location).checkString(),
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
      listingId: this.validateId(this.nullcheck(obj.sellerId)),
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
