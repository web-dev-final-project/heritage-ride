import { ObjectId } from "mongodb";
import { DataBaseException, NotFoundException, InvalidInputException } from "../utils/exceptions.js";
import Validator from "../utils/validator.js";
import { listings } from "./init.js";

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
};

export { getListingByUser, createListing };
