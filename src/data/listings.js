import { ObjectId } from "mongodb";
import { DataBaseException, NotFoundException, InvalidInputException } from "../utils/exceptions.js";
import Validator from "../utils/validator.js";
import { listings } from "./init.js";

const getListingByUser = async (userId) => {
const validId = Validator.validateId(userId);
try {
const db = await listings();
const result = await db.find({ sellerId: new ObjectId(validId) }).toArray();
if (!result) throw new NotFoundException(Listings not found for user ${userId});
return result;
} catch (e) {
throw new DataBaseException(e.message);
}
};

const createListing = async (sellerId, item) => {
const validSellerId = Validator.validateId(sellerId);
const validItem = Validator.validateItem(item);
try {
const db = await listings();
const res = await db.insertOne({
...validItem,
sellerId: new ObjectId(validSellerId),
createdAt: new Date().toUTCString(),
updatedAt: new Date().toUTCString(),
});
if (!res || !res.acknowledged || !res.insertedId)
throw new DataBaseException(Insert listing failed);
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
