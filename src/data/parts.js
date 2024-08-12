import { parts, cars } from "./init.js";
import { ObjectId } from "mongodb";
import Validator from "../utils/validator.js";
import { DataBaseException, NotFoundException } from "../utils/exceptions.js";

const createPart = async (name, price, manufacturer, sellerId, carIds) => {
    const partData = Validator.validatePart({
        name,
        price,
        manufacturer,
        sellerId,
        carIds
    });

    let newPart = {
        name: partData.name,
        price: partData.price,
        manufacturer: partData.manufacturer,
        sellerId: new ObjectId(partData.sellerId),
        carIds: partData.carIds.map(id => new ObjectId(id)),
        createdAt: new Date().toUTCString(), 
        updatedAt: new Date().toUTCString() 
    };

    try {
        const partsCollection = await parts();
        const insertInfo = await partsCollection.insertOne(newPart);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw new Error('Could not add part');
        }
        const newId = insertInfo.insertedId;
         return {
            ...newPart,
            _id: insertInfo.insertedId
        };
    } catch (e) {
        throw new DataBaseException(e.message);
    }
};

const getPartById = async (partId) => {
    const validPartId = Validator.validateId(partId);
    try {
        const partsCollection = await parts();
        const part = await partsCollection.findOne({ _id: new ObjectId(validPartId) });
        if (!part) throw new NotFoundException('Part not found');
        return part;
    } catch (e) {
        throw new DataBaseException(e.message);
    }
};

const searchPartsByName = async (searchQuery) => {
    searchQuery = Validator.validateString(searchQuery, 'Search Query');
    try {
        const partsCollection = await parts();
        const parts = await partsCollection.find(
            { name: { $regex: searchQuery, $options: 'i' } },
            { projection: { name: 1, price: 1, manufacturer: 1, specifications: 1, dateAdded: 1 } } 
        ).toArray();
        return parts;
    } catch (e) {
        throw new DataBaseException(e.message);
    }
};

const getCarsByPartId = async (partId) => {
    const validPartId = Validator.validateId(partId);
    try {
        const partsCollection = await parts();
        const part = await partsCollection.findOne({ _id: new ObjectId(validPartId) });
        if (!part) throw new NotFoundException('Part not found');

        const carIds = part.carIds;
        const carsCollection = await cars();
        const carsList = await carsCollection.find({ _id: { $in: carIds } }).toArray();

        return carsList;
    } catch (e) {
        throw new DataBaseException(e.message);
    }
};

export { createPart, getPartById, searchPartsByName, getCarsByPartId };


