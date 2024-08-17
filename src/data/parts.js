import { parts, listings } from "./init.js";
import { ObjectId } from "mongodb";
import Validator from "../utils/validator.js";
import {
  DataBaseException,
  databaseExceptionHandler,
  NotFoundException,
} from "../utils/exceptions.js";
import { 
  createListing, 
  getListingByUser, 
  getListingById, 
  updateListingById, 
  getListingByBuyer 
} from"./listings.js";


const createPart = async (name, description, tag, sellerId, carIds) => {
  let newPart = {
    name,
    description,
    tag,
    sellerId: new ObjectId(sellerId),
    carIds: carIds.map((id) =>new ObjectId(id)),
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString(),
  };

try {
  const partsCollection = await parts();
  const insertInfo = await partsCollection.insertOne(newPart);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw "Could not add Part";
  }

  const newId = insertInfo.insertedId;
  await createListing(sellerId, {
      itemId: newId.toString(),
      title: name,
  });
      return await getPartById(newId.toString());
    } catch (e) {
      throw new DataBaseException(e);
    }
  };

const getPartById = async (partId) => {
  const validPartId = Validator.validateId(partId);
  try {
    const partsCollection = await parts();
    const part = await partsCollection.findOne({ 
      _id: new ObjectId(validPartId) });

      if (!part) {
        throw new NotFoundException("Part not found");
      }
    return part;
  } catch (e) {
    throw new DataBaseException(e);
  }
};

const getParts = async () => {
  try {
    const partsCollection = await parts();
    return await partsCollection.find({}).toArray();
  } catch (e) {
    databaseExceptionHandler(e);
  }
};

const searchPartsByName = async (query) => {
  try {
    const listingsCollection = await listings();
    const partsCollection = await parts();

    const matchConditions = {};

    if (query.name)
      matchConditions["part.name"] = { $regex: new RegExp(query.name, "i") };
    if (query.description)
      matchConditions["part.description"] = { $regex: new RegExp(query.description, "i") };
    if (query.tag)
      matchConditions["part.tag"] = { $elemMatch: { $regex: new RegExp(query.tag, "i") } };
    
    const aggregation = [
      {
        $lookup: {
          from: "parts",
          localField: "itemId",
          foreignField: "_id",
          as: "part",
        },
      },
      {
        $addFields: { part: { $arrayElemAt: ["$part", 0] } },
      },
      {
        $match: matchConditions, 
      }
    ];
    
    const listingsWithParts = await listingsCollection
      .aggregate(aggregation)
      .toArray();
    return listingsWithParts;
  } catch (e) {
    throw new DataBaseException(e);
  }
};




export { createPart, getPartById, getParts, searchPartsByName };
