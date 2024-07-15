import { cars, listings } from "./init.js"
import { ObjectId } from "mongodb";
import Validator from "../utils/validator.js";

const createCar = async (make, model, year, category) => {
    // validate all args
    let newCar = {
        make: make,
        model: model,
        year: year,
        category: category
    }
    const carsCollection = await cars()
    const insertInfo = await carsCollection.insertOne(newCar)
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
       throw 'Could not add car'
  }
  const newId = insertInfo.insertedId;
  return await getCarById(newId.toString());
}

const createListing = async (itemId, price, seller, description) => { // move to listings.js
    // validate all args
    let newListing = {
        itemId: itemId,
        price: price,
        seller: seller,
        descritpion: description,
        mechanicReview: "empty",
        status: "open",
        listedTime: new Date()
    }
    const listingsCollection = await listings()
    const insertInfo = await listingsCollection.insertOne(newListing)
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
       throw 'Could not add listing'
  }
  const newId = insertInfo.insertedId;
  return await getCarById(newId.toString()); // or add get Listing by id
}

const getCarById = async (carId) => { // this will fire when a user clicks on a car after searching 
    const validCarId = Validator.validateId(carId);

    try {
        const carsCollection = await cars(); // Retrieve the cars collection
        //const listingsCollection = await listings(); // Retrieve the listings collection
    
      const car = await carsCollection.collection('cars').aggregate([
        {
          $match: { _id: validCarId }
        },
        {
          $lookup: {
            from: 'listings',
            localField: '_id',
            foreignField: 'itemId',
            as: 'listings'
          }
        }
      ]).toArray();
  
      return car[0]; // Since it's a single car, return the first result
    } catch (error) {
      console.error('Error fetching car by ID:', error);
      throw error;
    }
  };

  const getAll = async (query) => { // this will fire after a user enters search terms and clicks search
    // validate each query field
    try {
      const carsCollection = await cars(); // Retrieve the cars collection
      //const listingsCollection = await listings(); // Retrieve the listings collection
  
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
            price: { $arrayElemAt: ['$listings.price', 0] } // Get the price from the first listing (if available)
          }
        }
      ]).toArray();
  
      return result; // Return the array of matching cars with their make, model, year, and price
    } catch (error) {
      console.error('Error fetching cars:', error);
      throw error;
    }
  };
  
  export { createCar, createListing, getCarById, getAll };