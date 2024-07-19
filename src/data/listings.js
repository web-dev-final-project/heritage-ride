import { cars, listings } from "./init.js"
import { ObjectId } from "mongodb";
import Validator from "../utils/validator.js";
import { getCarById } from "./cars.js";
import { DataBaseException, NotFoundException } from "../utils/exceptions.js";

const createListing = async (itemId, price, seller, description) => {
    // add: validate all args
    let newListing = {
        itemId: itemId,
        price: price,
        seller: seller,
        descritpion: description,
        mechanicReview: "empty",
        status: "open",
        listedTime: new Date()
    }
    try {
        const listingsCollection = await listings()
        const insertInfo = await listingsCollection.insertOne(newListing)
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Could not add listing'
    }
    const newId = insertInfo.insertedId;
    return await getCarById(newId.toString()); // or add get Listing by id
}
  catch (e) {
    throw new DataBaseException(e);
}
}

const getAll = async (query) => { // this will fire after a user enters search terms and clicks search
    // Add: validate each query field
    try {
      const carsCollection = await cars();
      // Construct the aggregation pipeline to join cars with listings based on query
      const result = await carsCollection.aggregate([
        {
          $match: query // Match based on the provided query object
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
            price: { $arrayElemAt: ['$listings.price', 0] } // Get the price from the first listing
          }
        }
      ]).toArray();
  
      return result; // Return the array of matching cars with their make, model, year, and price
    } 
    catch (e) {
        throw new DataBaseException(e);
  }
}

export { createListing, getAll };