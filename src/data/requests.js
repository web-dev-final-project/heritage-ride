import { ObjectId } from "mongodb";
import Validator from "../utils/validator.js";
import { users, experts, listings} from "./init.js";
import { DataBaseException, databaseExceptionHandler, NotFoundException, ValidationException } from "../utils/exceptions.js";

const addRequest = async (expertId, listingId) => {
    const expert = Validator.validateId(expertId)
    const validId = Validator.validateId(listingId)
    try {
        const listing = await listings()
        const liRes = listing.findOne({_id: listingId})
        if (!liRes) throw new NotFoundException("Invalid listing")
        if (liRes.mechanicReviews.find(r => r.mechanicId === expertId))
            throw new ValidationException("You already have this review from this expert.")
        const db = await experts()
        const res = db.updateOne({
            _Id: new ObjectId(expert)}, 
            { $push: { requests: validId }, $set: { updateAt: new Date().toUTCString() } },
        { returnDocument: "after" })
        if (res.matchedCount === 0) {
            throw new NotFoundException("No expert found")
        }
        const emptyReview = {
            _id: new ObjectId(),
            mechanicId: expert,
            status: "pending",
            review: null
        }
        const listingRes = liRes.updateOne({
            _Id: new ObjectId(validId)}, 
            { $push: { mechanicReviews: emptyReview }, $set: { updateAt: new Date().toUTCString() } },
            { returnDocument: "after" })
        if (listingRes.matchedCount === 0) {
            throw new NotFoundException("No listing found")
        }
        return res
    }
    catch(e) {
        databaseExceptionHandler(e)
    }
}

const addReview = async (expertId, review, listingId) => {
    const validExpertId = Validator.validateId(expertId)
    const validReview = Validator.validateReview(review)
    const validIListingId = Validator.validateId(listingId)
    try {
        const expertDb = await experts()
        const listingDb = await listings()
        const expertRes = expertDb.updateOne(
            {_Id: new ObjectId(validExpertId )},
            { $pull: { requests: validIListingId }, $set: { updateAt: new Date().toUTCString() } }
        )
        if (expertRes.matchedCount === 0) {
            throw new NotFoundException("No expert found")
        }
        const listingRes = listingDb.updateOne({
            _Id: new ObjectId(validIListingId)}, 
            { $set: { updateAt: new Date().toUTCString(), "mechanicReviews.$.review": validReview }},
            { returnDocument: "after" })
        if (listingRes.matchedCount === 0) {
            throw new NotFoundException("No listing found")
        }
        return listingRes
    }
    catch(e) {
        databaseExceptionHandler(e)
    }
}

const getRequestListings = async (expertId) => {
    const validExpertId = Validator.validateId(expertId)
    try {
        const listingDb = await listings()
        const res = listingDb.find({"mechanicReviews.mechanicId": new ObjectId(validExpertId)})
        return res
    }
    catch(e) {
        databaseExceptionHandler(e)
    }

}

const getRequestById = async (requestId) => {

}

export {addRequest, addReview, getRequestListings}