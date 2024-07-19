import { cars } from "./init.js"
import { ObjectId } from "mongodb";
import Validator from "../utils/validator.js";
import { DataBaseException, NotFoundException } from "../utils/exceptions.js";

const createCar = async (make, model, year, category) => {
    // Add: validate all args
    let newCar = {
        make: make,
        model: model,
        year: year,
        category: category
    }
    try {
      const carsCollection = await cars()
      const insertInfo = await carsCollection.insertOne(newCar)
      if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Could not add car'
      }
      const newId = insertInfo.insertedId;
      return await getCarById(newId.toString());
    }
    catch (e) {
      throw new DataBaseException(e);
    }
}
const getCarById = async (carId) => {
    const validCarId = Validator.validateId(carId);
    try {
      const carsCollection = await cars();
      const car = await carsCollection.findOne({ _id: new ObjectId(validCarId) });
    
      return car;
    } 
    catch (e) {
      throw new DataBaseException(e);
    }
  };
  
  export { createCar, getCarById };