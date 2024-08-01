import { DataBaseException } from "../utils/exceptions.js";
import Validator from "../utils/validator.js";
import { users, experts } from "./init.js";
import { ObjectId } from "mongodb";
import { addRole } from "./users.js";
import { databaseExceptionHandler } from "../utils/exceptions.js";

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
  let validId = Validator.validateId(userId);
  const expertDb = await experts();
  const expert = expertDb.findOne({
  userId: new ObjectId(validId),
    role: "expert",
  })
  if (!expert)
    throw new DataBaseException(`Expert with ID ${validId} not found`);

  return expert;
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

const createExpert = async (expert) => {
  try {
    const db = await experts();
    const validatedExpert = Validator.validateExpert(expert)
    validatedExpert.reviews = []
    validatedExpert.requests = []
    await addRole(expert.userId, "expert")
    const res = await db.insertOne(
      {
        ...validatedExpert,
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
      }
    )
    if (!res || !res.acknowledged || !res.insertedId)
      new DataBaseException("failed to insert expert.");
    return {
      ...validatedExpert,
      _id: res.insertedId,
    };

  } catch (e) {
    throw new DataBaseException(e);
  }
}
 
export { getAllExperts, getExpertById, searchExpertsByName, createExpert };
