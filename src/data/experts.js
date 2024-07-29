import { DataBaseException } from "../utils/exceptions.js";
import Validator from "../utils/validator.js";
import { users } from "./init.js";
import { ObjectId } from "mongodb";

const getAllExperts = async () => {
  try {
    const db = await users();
    const experts = await db.find({ role: "expert" }).toArray();
    return experts;
  } catch (e) {
    throw new DataBaseException(e);
  }
};

const getExpertById = async (userId) => {
  try {
    let validId = Validator.validateId(userId);
    const db = await users();
    const expert = await db.findOne({
      _id: new ObjectId(validId),
      role: "expert",
    });
    if (!expert)
      throw new DataBaseException(`Expert with ID ${validId} not found`);
    return expert;
  } catch (e) {
    throw new DataBaseException(e);
  }
};

const searchExpertsByName = async (name) => {
  try {
    const db = await users();
    const experts = await db
      .find({
        $or: [
          { firstName: { $regex: name, $options: "i" } },
          { lastName: { $regex: name, $options: "i" } },
        ],
        role: { $in: ["expert"] },
      })
      .toArray();
    return experts;
  } catch (e) {
    throw new DataBaseException(e);
  }
};

export { getAllExperts, getExpertById, searchExpertsByName };
