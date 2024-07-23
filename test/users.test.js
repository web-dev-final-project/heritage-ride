import { createUser } from "../src/data/users.js";
import {
  TypeException,
  InvalidInputException,
  InvalidValueException,
} from "../src/utils/exceptions.js";

describe("test user functions", () => {
  let test_user = {
    firstName: "Jane",
    lastName: "Jones",
    userName: "boby",
    password: "1234567890",
    email: "njrealaccount@gmail.com",
    address: "test address",
    avatar: "http://www.google.com",
  };
  it("should failed to create user", async () => {
    for (let [key, val] of Object.entries(test_user)) {
      await expect(createUser({ ...test_user, [key]: 12 })).rejects.toThrow(
        TypeException
      );
      await expect(createUser({ ...test_user, [key]: " " })).rejects.toThrow(
        InvalidValueException
      );
    }
    await expect(
      createUser({ ...test_user, email: "some fake email" })
    ).rejects.toThrow(InvalidValueException);
    await expect(
      createUser({ ...test_user, avatar: "some fake avatar url" })
    ).rejects.toThrow(InvalidValueException);
  });
});
