import { ObjectId } from "mongodb";
import {
  DataBaseException,
  NotFoundException,
  InvalidInputException,
} from "../utils/exceptions.js";
import Validator from "../utils/validator.js";
import { cars, listings } from "./init.js";
import { getCarById } from "./cars.js";

const getListingByUser = async (userId) => {
  const validId = Validator.validateId(userId);

  let db;
  let result;
  try {
    db = await listings();
    result = await db.find({ sellerId: new ObjectId(validId) }).toArray();
  } catch (e) {
    throw new DataBaseException("Error fetching listings");
  }
  return result;
};

const createListing = async (sellerId, item) => {
  const validSellerId = Validator.validateId(sellerId);
  const validItem = Validator.validateListing(item);

  try {
    const db = await listings();
    const res = await db.insertOne({
      ...validItem,
      status: "open",
      itemId: new ObjectId(validItem.itemId),
      sellerId: new ObjectId(validSellerId),
      mechanicReviews: [],
      createdAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
    });

    if (!res || !res.acknowledged || !res.insertedId) {
      throw new DataBaseException("Insert listing failed");
    }
    return {
      ...item,
      _id: res.insertedId,
    };
  } catch (e) {
    throw new DataBaseException(e.message);
  }
};

const getAll = async (query) => {
  // this will fire after a user enters search terms and clicks search
  // Add: validate each query field
  try {
    const listingCollection = await listings();
    // Build the query object
    const matchConditions = {};

    if (query.make)
      matchConditions["car.make"] = { $regex: new RegExp(query.make, "i") };
    if (query.model)
      matchConditions["car.model"] = { $regex: new RegExp(query.model, "i") };
    if (query.year) matchConditions["car.year"] = query.year;
    if (query.category)
      matchConditions["car.category"] = {
        $regex: new RegExp(query.category, "i"),
      };

    const aggregation = [
      {
        $lookup: {
          from: "cars",
          localField: "itemId",
          foreignField: "_id",
          as: "car",
        },
      },
      {
        $addFields: { car: { $arrayElemAt: ["$car", 0] } },
      },
      {
        $match: matchConditions, // Match based on the provided query object
      },
    ];

    const listingsWithCars = await listingCollection
      .aggregate(aggregation)
      .toArray();
    return listingsWithCars;
  } catch (e) {
    throw new DataBaseException(e);
  }
};

const getListingById = async (listingId) => {
    //console.log(listingId)
    const valListingId = Validator.validateId(listingId);
    //console.log(valListingId)
    try {
      const listingsCollection = await listings();
      const listing = await listingsCollection.findOne({ _id: new ObjectId(valListingId) });
   
      return listing;
    }
    catch (e) {
      throw new DataBaseException(e);
    }
  };
 

export { createListing, getAll, getListingByUser, getListingById };
