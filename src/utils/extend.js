import { EmptyStringException, TypeException } from "./exceptions.js";

Object.prototype.checkEmpty = function () {
  if (typeof this === "string" && this.trim().length === 0) {
    throw new EmptyStringException();
  }
  return this;
};
Object.prototype.checkString = function () {
  if (typeof this !== "string") throw new TypeException();
  const st = this.trim();
  if (st.length === 0) throw new Error();
  return this.trim();
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
