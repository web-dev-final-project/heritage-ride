import {
  DataBaseException,
  NotFoundException,
  ValidationException,
} from "../utils/exceptions.js";
import Validator from "../utils/validator.js";
import { users, experts } from "./init.js";
import { ObjectId } from "mongodb";
import { addRole } from "./users.js";
import { databaseExceptionHandler } from "../utils/exceptions.js";
import { handleAddError, handleUpdateError } from "../utils/databaseUtil.js";

const getAllExperts = async () => {
  try {
    const expertDb = await experts();
    const aggregation = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$user", 0] },
        },
      },
    ];

    const results = await expertDb.aggregate(aggregation).toArray();
    return results;
  } catch (e) {
    throw new DataBaseException(e);
  }
};

const getExpertById = async (expertId) => {
  try {
    let validId = Validator.validateId(expertId);
    const expertDb = await experts();
    const userDb = await users();
    const expert = await expertDb.findOne({
      _id: new ObjectId(validId),
    });
    if (!expert)
      throw new NotFoundException(`Expert with ID ${validId} not found`);
    const user = await userDb.findOne({ _id: new ObjectId(expert.userId) });
    delete user.password;
    return { ...expert, user };
  } catch (e) {
    databaseExceptionHandler(e);
  }
};

const getExpertByUserId = async (userId) => {
  try {
    let validId = Validator.validateId(userId);
    const expertDb = await experts();
    const expert = await expertDb
      .aggregate([
        {
          $match: {
            userId: new ObjectId(validId),
          },
        },
        {
          $lookup: {
            from: "listings",
            localField: "requests",
            foreignField: "_id",
            as: "reviews",
          },
        },
      ])
      .toArray();
    if (expert.length === 0)
      throw new NotFoundException(`Expert with ID ${validId} not found`);
    return expert[0];
  } catch (e) {
    databaseExceptionHandler(e);
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

const createExpert = async (expert) => {
  try {
    const db = await experts();
    const validatedExpert = Validator.validateExpert(expert);
    validatedExpert.reviews = [];
    validatedExpert.requests = [];
    validatedExpert.carReviewed = 0;
    validatedExpert.userId = new ObjectId(validatedExpert.userId);
    if (expert.role.includes("expert"))
      throw new ValidationException("User is already an expert");
    await addRole(expert.userId, "expert");
    const res = await db.insertOne({
      ...validatedExpert,
      createdAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
    });
    handleAddError(res);
    return {
      ...validatedExpert,
      _id: res.insertedId,
    };
  } catch (e) {
    databaseExceptionHandler(e);
  }
};

const updateExpert = async (expert, userId) => {
  try {
    const db = await experts();
    const validatedExpert = Validator.validateExpert(expert);
    const validatedId = Validator.validateId(userId);
    const res = await db.updateOne(
      { userId: new ObjectId(validatedId) },
      {
        $set: {
          ...validatedExpert,
          userId: new ObjectId(userId),
          updatedAt: new Date().toUTCString(),
        },
      }
    );
    handleUpdateError(res);
    return res;
  } catch (e) {
    databaseExceptionHandler(e);
  }
};

export {
  getAllExperts,
  getExpertById,
  searchExpertsByName,
  createExpert,
  getExpertByUserId,
  updateExpert,
};
