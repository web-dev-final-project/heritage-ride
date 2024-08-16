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
    searchQuery = Validator.validateString(searchQuery, 'Search Query');
    try {
        const partsCollection = await parts();
        const results = await partsCollection.aggregate([
            {
                $match: {
                    name: { $regex: searchQuery, $options: 'i' }
                }
            },
            {
                $lookup: {
                    from: "listings", 
                    localField: "_id", 
                    foreignField: "itemId", 
                    as: "listings" 
                }
            },
            {
                $unwind: {
                    path: "$listings",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "cars", 
                    localField: "listings.itemId", 
                    foreignField: "_id", 
                    as: "carDetails" 
                }
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    price: { $first: "$price" },
                    manufacturer: { $first: "$manufacturer" },
                    listings: { $push: "$listings" },
                    carDetails: { $push: "$carDetails" }
                }
            }
        ]).toArray();
        return results.map(part => ({
            ...part,
            cars: part.carDetails.flat()
        }));
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
