import { DataBaseException } from "../utils/exceptions.js";
import Validator from "../utils/validator.js";
import { users } from "../data/init.js";

const createUser = async (user) => {
  try {
    const valUser = Validator.validateUser(user);
    const db = await users();
    const res = await db.insertOne(valUser);
    if (!res || !res.acknowledged || !res.insertedId)
      new DataBaseException(`Insert user ${user.email} failed`);
    return {
      ...user,
      _id: res.insertedId,
    };
  } catch (e) {
    throw new DataBaseException(e);
  }
};

export { createUser };
