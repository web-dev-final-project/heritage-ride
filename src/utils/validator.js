class Validator {
  static validateListing(obj) {
    return obj;
  }

  static validateCar(obj) {
    return obj;
  }

  static validateUser(obj) {
    let user = obj.checkNull();
    user = {
      firstName: obj.firstName.checkNull().checkString(),
      lastName: obj.lastName.checkNull().checkString(),
      userName: obj.userName.checkNull().checkString(),
      password: obj.password.checkNull().checkString(),
      email: obj.email.checkNull().checkString().checkEmail(),
      address: obj.address
        ? obj.address.checkNull().checkString()
        : obj.address,
      role: obj.role.checkNull().checkStringArray(),
    };
    return user;
  }

  static validatePart(obj) {
    return obj;
  }
}

export default Validator;
