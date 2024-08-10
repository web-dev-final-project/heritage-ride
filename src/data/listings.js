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
        description: description,
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
    return await getCarById(newId.toString()); // should be add getListing by id?
}
  catch (e) {
    throw new DataBaseException(e);
}
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
                  price: '$listings.price', // Use the price from listings if available
                  listingId: '$listings._id'
              }
          }
      ]).toArray();

      return result;
  } catch (e) {
      throw new DataBaseException(e);
  }
}

const getListingById = async (listingId) => {
    console.log(listingId)
    const valListingId = Validator.validateId(listingId);
    console.log(valListingId)
    try {
      const listingsCollection = await listings();
      const listing = await listingsCollection.findOne({ _id: new ObjectId(valListingId) });
    
      return listing;
    } 
    catch (e) {
      throw new DataBaseException(e);
    }
  };

export { createListing, getAll, getListingById };