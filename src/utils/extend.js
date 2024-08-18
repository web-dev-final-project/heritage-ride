import { ObjectId } from "mongodb";
import {
  EmptyStringException,
  TypeException,
  NullException,
  InvalidValueException,
  ValidationException,
} from "./exceptions.js";
import xss from "xss";

Object.prototype.checkNull = function (name = "input") {
  if (!this || this == null || this == undefined) {
    throw new NullException(`${name} can not be an empty.`);
  }
  return this;
};

Object.prototype.checkString = function (
  min = 0,
  max = Number.POSITIVE_INFINITY,
  name = "input"
) {
  if (typeof this !== "string") throw new TypeException();
  const st = xss(this.trim());
  if (st.length < min || st.length > max)
    throw new InvalidValueException(
      `length of ${name} can not be an less than ${min} or longer than ${max}`
    );
  return st;
};
Object.prototype.checkBoolean = function () {
  if (typeof this !== "boolean") throw new TypeException();
  return this;
};
Object.prototype.checkObject = function () {
  if (
    Object.prototype.toString.call(this) === "[object Object]" &&
    (Object.getPrototypeOf(this) === Object.prototype ||
      Object.getPrototypeOf(this) === null)
  )
    return this;
  throw new TypeException();
};
Object.prototype.checkArray = function () {
  if (!Array.isArray(this)) throw new TypeException();
  return this;
};

String.prototype.checkEmpty = function (input = "string") {
  if (typeof this === "string" && this.trim().length === 0) {
    throw new EmptyStringException(`${input} can't not be empty`);
  }
  return this.trim();
};
String.prototype.checkObjectId = function (input = "value") {
  let str = this.valueOf();
  if (!ObjectId.isValid(str)) {
    throw new InvalidValueException(`Invalid Id ${input}.`);
  }
  return str;
};
String.prototype.checkSpace = function (input = "input") {
  if (this.valueOf().includes(" ")) {
    throw new InvalidValueException(`${input} should not contain space`);
  }
  return this.valueOf();
};
String.prototype.checkCharacter = function (input = "input") {
  if (!/^[A-Za-z]+$/.test(this.valueOf()))
    throw new InvalidValueException(`${input} should only contains letters`);
  return this.valueOf();
};
String.prototype.checkUrl = function () {
  try {
    const str = this.valueOf();
    let url = new URL(str);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return str;
    }
    throw new InvalidValueException("Url must contain http or https");
  } catch (e) {
    throw new InvalidValueException(e.message);
  }
};

String.prototype.checkEmail = function () {
  const re = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (!re.test(this.valueOf()))
    throw new InvalidValueException("Email is not valid.");
  return this;
};
String.prototype.checkPassword = function () {
  const pass = this.valueOf();
  if (pass.includes(" "))
    throw new InvalidValueException("Password cannot contains spaces.");
  if (pass.length < 8)
    throw new InvalidValueException("Password must be at least 8 charactors.");
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(pass)) {
    throw new InvalidValueException(
      "Password must contains at least a lower case, upper case and numbers."
    );
  }
  const xssFree = /^[a-zA-Z0-9 _\-@#$%^&*!]+$/;
  if (!xssFree.test(pass)) {
    throw new InvalidValueException(
      "Password can only contains special characters such as _-@#$%^&*!"
    );
  }
  return pass;
};
Array.prototype.checkIsEmpty = function () {
  if (this.length === 0)
    throw new InvalidValueException("Array can not be empty.");
  return this;
};
Array.prototype.checkNumberArray = function (name = "array") {
  if (this.some((item) => typeof item !== "number"))
    throw new InvalidValueException(`${name} should only contains numbers`);
  return this;
};
Array.prototype.checkStringArray = function (name = "array") {
  if (this.some((item) => typeof item !== "string" || item.length === 0))
    throw new InvalidValueException(
      `${name} should only contains valid strings`
    );
  return this;
};
Object.prototype.containsValue = function (val) {
  if (!Object.values(this).includes(val)) return false;
  return true;
};

Object.prototype.checkNumber = function (
  min = -Number.MAX_VALUE * 2,
  max = Number.MAX_VALUE * 2,
  name = "input"
) {
  if (typeof this !== "number") {
    throw new TypeException(`${name} must be number.`);
  }
  if (this.valueOf() < min || this.valueOf() > max) {
    throw new InvalidValueException(
      `${name} must be larger than ${min} and less than ${max}`
    );
  }
  return this;
};

const Role = {
  seller: "seller",
  expert: "expert",
  user: "user",
};

export { Role };
