<<<<<<< HEAD
=======
import { generateToken } from "../utils/auth.js";
>>>>>>> 2c6a561f49812957dfa89abf43e6b6bd8ac694e9
import { DataBaseException, NotFoundException } from "../utils/exceptions.js";
import Validator from "../utils/validator.js";
import { users } from "./init.js";
import { ObjectId } from "mongodb";

const createUser = async (user) => {
  const valUser = Validator.validateUser(user);
  valUser.email = valUser.email.toLowerCase();
  try {
    const db = await users();
    const res = await db.insertOne(
      {
        ...valUser,
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
      },
      { password: 0 }
    );
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

const findUserByEmailOrUserName = async (username, userEmail) => {
  let userName = username.checkString();
  let email = userEmail.checkString().toLowerCase();
  let user;
  try {
    const db = await users();
    user = await db.findOne({
      $or: [{ userName: userName }, { email: email }],
    });
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

const getAllExperts = async () => {
  try {
    const db = await users();
    const experts = await db.find({ role: 'expert' }).toArray();
    return experts;
  } catch (e) {
    throw new DataBaseException(e);
  }
};

const getExpertById = async (userId) => {
  try {
    let validId = Validator.validateId(userId);
    const db = await users();
    const expert = await db.findOne({ _id: new ObjectId(validId), role: 'expert' });
    if (!expert) throw new DataBaseException(`Expert with ID ${validId} not found`);
    return expert;
  } catch (e) {
    throw new DataBaseException(e);
  }
};

const searchExpertsByName = async (name) => {
  try {
    const db = await users();
    const experts = await db.find({
      $or: [
        { firstName: { $regex: name, $options: 'i' } },
        { lastName: { $regex: name, $options: 'i' } }
      ],
      role: { $in: ['expert'] }
    }).toArray();
    return experts;
  } catch (e) {
    throw new DataBaseException(e);
  }
};

export { createUser, updateUser, addRole, findUser, findUserByEmailOrUserName, getAllExperts, getExpertById, searchExpertsByName };
