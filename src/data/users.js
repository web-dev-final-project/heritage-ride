import { ObjectId } from "mongodb";
import { DataBaseException, NotFoundException } from "../utils/exceptions.js";
import Validator from "../utils/validator.js";
import { users } from "./init.js";

const createUser = async (user) => {
  const valUser = Validator.validateUser(user);
  try {
    const db = await users();
    const res = await db.insertOne({
      ...valUser,
      createdAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
    });
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
const updateUser = async (user) => {
  const valUser = Validator.validateUser(user);
  delete valUser.role;
  valUser.updatedAt = new Date().toUTCString();
  try {
    const db = await users();
    return await db.findOneAndUpdate(
      { _id: new ObjectId(valUser.id) },
      { $set: valUser },
      { returnDocument: "after" }
    );
  } catch (e) {
    throw new DataBaseException(e);
  }
};

const findUser = async (id) => {
  let validId = Validator.validateId(id);
  let user;
  try {
    const db = await users();
    user = await db.findOne({ _id: new ObjectId(validId) });
  } catch (e) {
    throw new DataBaseException(e);
  }
  return user;
};

const findUserByEmail = async (email) => {
  let validEmail = email.checkString().checkEmail();
  let user;
  try {
    const db = await users();
    user = await db.findOne({ email: validEmail });
  } catch (e) {
    throw new DataBaseException(e);
  }
  return user;
};

const findUserByUserName = async (userName) => {
  let validUserName = userName.checkString();
  let user;
  try {
    const db = await users();
    user = await db.findOne({ userName: validUserName });
  } catch (e) {
    throw new DataBaseException(e);
  }
  return user;
};

const addRole = async (id, role) => {
  const user = await findUser(id);
  if (!user) throw new NotFoundException("user not found in the database");
  const db = await users();
  if (user.role.includes(role)) {
    throw new DataBaseException("user already has this role.");
  }
  return await db.updateOne(
    { _id: new ObjectId(user._id) },
    { $push: { role: role }, $set: { updateAt: new Date().toUTCString() } },
    { returnDocument: "after" }
  );
};
const removeRole = async (id, role) => {};

export {
  createUser,
  updateUser,
  addRole,
  findUser,
  findUserByEmail,
  findUserByUserName,
};
