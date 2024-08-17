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
import { addRole, findUser, updateUser } from "./users.js";

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
    if (validItem.itemType === 'car') { // check if car or part
      const { carId, price, image } = validItem;
      
      const car = await getCarById(carId) 
      const db = await listings();
      const res = await db.insertOne({
        itemId: new ObjectId(carId),
        title: `${car.make} ${car.model}`,
        description: car.description,
        price: price,
        status: "open",
        sellerId: new ObjectId(validSellerId),
        mechanicReviews: [],
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
        image: image,
        itemType: validItem.itemType
      });

      if (!res || !res.acknowledged || !res.insertedId) {
        throw new DataBaseException("Insert listing failed");
      }
      // Update role to seller
      // const user = await findUser(validSellerId);
      // if (!user) {
      //   throw new DataBaseException("User not found");
      // }
      // if (!user.role.includes("seller")) {
      //   user.role.push("seller");
      // }
      // await updateUser(user);

      return {
        ...item,
        _id: res.insertedId,
      };
    }
    else {
      // code for inserting part
    }
  } catch (e) {
    throw new DataBaseException(e.message);
  }
};

const getAll = async (query) => { // for cars
  // this will fire after a user enters search terms and clicks search
  try {
    const valQuery = Validator.validateQuery(query)
    const listingCollection = await listings();
    // Build the query object
    const matchConditions = {};

    if (valQuery.make)
      matchConditions["car.make"] = { $regex: new RegExp(valQuery.make, "i") };
    if (valQuery.model)
      matchConditions["car.model"] = { $regex: new RegExp(valQuery.model, "i") };
    if (valQuery.year) matchConditions["car.year"] = valQuery.year;
    if (valQuery.category)
      matchConditions["car.category"] = {
        $regex: new RegExp(valQuery.category, "i"),
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
