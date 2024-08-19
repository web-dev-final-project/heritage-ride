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
    const expert = await expertDb
      .aggregate([
        {
          $match: {
            _id: new ObjectId(validId),
          },
        },
        {
          $lookup: {
            from: "listings",
            localField: "carReviewed",
            foreignField: "_id",
            as: "pastReviews",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();
    if (expert.length === 0)
      throw new NotFoundException(`Expert with ID ${validId} not found`);
    delete expert[0].user.password;
    return expert[0];
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
            as: "pendingReviews",
          },
        },
        {
          $lookup: {
            from: "listings",
            localField: "carReviewed",
            foreignField: "_id",
            as: "pastReviews",
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
    const res = await db
      .aggregate([
        {
          $lookup: {
            from: "experts",
            localField: "_id",
            foreignField: "userId",
            as: "expert",
          },
        },
        {
          $unwind: {
            path: "$expert",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $match: {
            $or: [
              { firstName: { $regex: name, $options: "i" } },
              { lastName: { $regex: name, $options: "i" } },
              { userName: { $regex: name, $options: "i" } },
              { "expert.skills": { $regex: name, $options: "i" } },
              { "expert.location": { $regex: name, $options: "i" } },
            ],
          },
        },
      ])
      .toArray();
    const experts = [];
    for (let item of res) {
      const expert = { ...item.expert };
      delete item.expert;
      delete item.password;
      expert.user = item;
      experts.push(expert);
    }

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
