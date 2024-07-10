import { ObjectId } from "mongodb";
import { InvalidInputException, InvalidValueException } from "./exceptions.js";
import { Role } from "./extend.js";

class Validator {
  static validateListing(obj) {
    return obj;
  }

  static validateCar(obj) {
    return obj;
  }

  static validateUser(obj) {
    if (!obj) throw new InvalidInputException("Input must not be empty");
    let user = obj.checkNull();
    user = {
      ...obj,
      firstName: obj.firstName.checkNull().checkString(),
      lastName: obj.lastName.checkNull().checkString(),
      userName: obj.userName.checkNull().checkString(),
      password: obj.password.checkNull().checkString(),
      avatar: obj.avatar ? obj.avatar.checkString().checkUrl() : null,
      email: obj.email.checkNull().checkString().checkEmail(),
      address: obj.address
        ? obj.address.checkNull().checkString()
        : obj.address,
    };
    return user;
  }
  static validateId(id) {
    let str = id.checkNull().checkString();
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
    return obj;
  }
}

export default Validator;
