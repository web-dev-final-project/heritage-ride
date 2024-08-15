import { parts, cars } from "./init.js";
import { ObjectId } from "mongodb";
import Validator from "../utils/validator.js";
import {
  DataBaseException,
  databaseExceptionHandler,
  NotFoundException,
} from "../utils/exceptions.js";

const createPart = async (name, price, manufacturer, sellerId, carIds) => {
  const partData = Validator.validatePart({
    name,
    price,
    manufacturer,
    sellerId,
    carIds,
  });

  let newPart = {
    name: partData.name,
    price: partData.price,
    manufacturer: partData.manufacturer,
    sellerId: new ObjectId(partData.sellerId),
    carIds: partData.carIds.map((id) => new ObjectId(id)),
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString(),
  };

  try {
    const partsCollection = await parts();
    const insertInfo = await partsCollection.insertOne(newPart);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw new Error("Could not add part");
    }
    return {
      ...newPart,
      _id: insertInfo.insertedId,
    };
  } catch (e) {
    throw new DataBaseException(e);
  }
};

const getPartById = async (partId) => {
  const validPartId = Validator.validateId(partId);
  try {
    const partsCollection = await parts();
    const part = await partsCollection.findOne({
      _id: new ObjectId(validPartId),
    });
    if (!part) throw new NotFoundException("Part not found");
    return part;
  } catch (e) {
    databaseExceptionHandler(e);
  }
};

const searchPartsByName = async (searchQuery) => {
  searchQuery = searchQuery.checkString();
  try {
    const partsCollection = await parts();
    const results = await partsCollection
      .aggregate([
        {
          $lookup: {
            from: "cars",
            localField: "manufacturer",
            foreignField: "make",
            as: "carDetails",
          },
        },
        {
          $unwind: {
            path: "$carDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            $or: [
              { name: { $regex: searchQuery, $options: "i" } },
              { manufacturer: { $regex: searchQuery, $options: "i" } },
              { "carDetails.make": { $regex: searchQuery, $options: "i" } },
              { "carDetails.model": { $regex: searchQuery, $options: "i" } },
            ],
          },
        },
      ])
      .toArray();
    return results;
  } catch (e) {
    throw new DataBaseException(e);
  }
};

const getPartByCarId = async (carId) => {
  const validCarId = Validator.validateId(carId);
  try {
    const partsCollection = await parts();
    const partsList = await partsCollection
      .find({ carIds: new ObjectId(validCarId) })
      .toArray();
    if (partsList.length === 0) {
      throw new NotFoundException("No parts found");
    }
    return partsList;
  } catch (e) {
    throw new DataBaseException(e);
  }
};

export { createPart, getPartById, searchPartsByName, getPartByCarId };
