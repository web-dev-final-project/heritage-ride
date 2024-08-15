import { ObjectId } from "mongodb";
import {
  DataBaseException,
  NotFoundException,
  InvalidInputException,
  databaseExceptionHandler,
} from "../utils/exceptions.js";
import Validator from "../utils/validator.js";
import { cars, listings, transactions } from "./init.js";
import { getCarById } from "./cars.js";
import { handleUpdateError } from "../utils/databaseUtil.js";

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

const getListingByBuyer = async (userId) => {
  const validId = Validator.validateId(userId);
  try {
    const transDb = await transactions();
    const result = await transDb
      .aggregate([
        {
          $match: { buyerId: new ObjectId(validId) },
        },
        {
          $lookup: {
            from: "listings",
            localField: "listingId",
            foreignField: "_id",
            as: "listing",
          },
        },
        {
          $unwind: "$listing",
        },
        {
          $addFields: {
            "listing.transaction": "$$ROOT",
          },
        },
        {
          $replaceRoot: {
            newRoot: "$listing",
          },
        },
      ])
      .toArray();
    return result;
  } catch (e) {
    databaseExceptionHandler(e);
  }
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
  const valListingId = Validator.validateId(listingId);
  try {
    const listingsCollection = await listings();
    const listing = await listingsCollection.findOne({
      _id: new ObjectId(valListingId),
    });
    if (!listing) throw new NotFoundException("No listing with this id found.");
    return listing;
  } catch (e) {
    databaseExceptionHandler(e);
  }
};

const updateListingById = async (id, updates) => {
  try {
    const listingsCollection = await listings();
    const valListingId = Validator.validateId(id);
    const validUpdate = Validator.validatePartialListing(updates);
    const res = await listingsCollection.updateOne(
      { _id: new ObjectId(valListingId) },
      { $set: { ...validUpdate } }
    );
    handleUpdateError(res);
  } catch (e) {
    databaseExceptionHandler(e);
  }
};

export {
  createListing,
  getAll,
  getListingByUser,
  getListingById,
  updateListingById,
  getListingByBuyer,
};
