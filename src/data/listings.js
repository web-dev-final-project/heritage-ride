import { ObjectId } from "mongodb";
import { DataBaseException, NotFoundException, InvalidInputException } from "../utils/exceptions.js";
import Validator from "../utils/validator.js";
import { cars, listings } from "./init.js"
import { getCarById } from "./cars.js";

const getListingByUser = async (userId) => {
    const validId = Validator.validateId(userId);

    let db;
    let result;
    try {
        db = await listings();
        result = await db.find({ sellerId: new ObjectId(validId) }).toArray();
    } catch (e) {
    throw new DataBaseException('Error fetching listings');
    }
    
if (!result || result.length === 0) {
    throw new NotFoundException(`Listings not found for user.`);
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
        sellerId: new ObjectId(validSellerId),
        createdAt: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
    });

    if (!res || !res.acknowledged || !res.insertedId) {
        throw new DataBaseException('Insert listing failed');
    }
        return {
            ...item,
            _id: res.insertedId,
            sellerId: validSellerId,
        };
    } catch (e) {
    throw new DataBaseException(e.message);
}

const getAll = async (query) => { // this will fire after a user enters search terms and clicks search
    // Add: validate each query field
    try {
      const carsCollection = await cars();
      // Build the query object
      const matchConditions = {};

      if (query.make) matchConditions.make = query.make;
      if (query.model) matchConditions.model = query.model;
      if (query.year) matchConditions.year = query.year;
      if (query.category) matchConditions.category = query.category;

      // Perform the aggregation with OR conditions
      const result = await carsCollection.aggregate([
          {
              $match: matchConditions // Match based on the provided query object
          },
          {
              $lookup: {
                  from: 'listings',
                  localField: '_id',
                  foreignField: 'itemId',
                  as: 'listings'
              }
          },
          {
              $project: {
                  make: 1,
                  model: 1,
                  year: 1,
                  price: '$listings.price' // Use the price from listings if available
              }
          }
      ]).toArray();

      return result;
  } catch (e) {
      throw new DataBaseException(e);
  }
}

export { createListing, getAll };

