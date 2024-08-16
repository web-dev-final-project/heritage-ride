import { ObjectId } from "mongodb";
import Validator from "../utils/validator.js";
import { users, experts, listings } from "./init.js";
import {
  DataBaseException,
  databaseExceptionHandler,
  NotFoundException,
  ValidationException,
} from "../utils/exceptions.js";
import { handleUpdateError } from "../utils/databaseUtil.js";

const addRequest = async (expert, listingId) => {
  const validId = Validator.validateId(listingId);
  try {
    const listing = await listings();
    const liRes = await listing.findOne({ _id: new ObjectId(listingId) });
    if (!liRes) throw new NotFoundException("Invalid listing");
    if (liRes.mechanicReviews.find((r) => r.mechanicId === expert._id))
      throw new ValidationException(
        "You already have this review from this expert."
      );
    const db = await experts();
    if (expert.requests.some((requestId) => requestId.equals(validId))) {
      throw new ValidationException("request already existed.");
    }
    const res = await db.updateOne(
      {
        _id: new ObjectId(expert._id),
      },
      {
        $push: { requests: new ObjectId(validId) },
        $set: { updateAt: new Date().toUTCString() },
      },
      { returnDocument: "after" }
    );
    if (res.matchedCount === 0) {
      throw new NotFoundException("No expert found");
    }
    const emptyReview = {
      _id: new ObjectId(),
      mechanic: expert,
      status: "pending",
      review: null,
      createdAt: new Date().toUTCString(),
    };
    const listingRes = await listing.updateOne(
      {
        _id: new ObjectId(validId),
      },
      {
        $push: { mechanicReviews: emptyReview },
        $set: { updateAt: new Date().toUTCString() },
      },
      { returnDocument: "after" }
    );
    if (listingRes.matchedCount === 0) {
      throw new NotFoundException("No listing found");
    }
  } catch (e) {
    databaseExceptionHandler(e);
  }
};

const addReview = async (expertId, review, listingId) => {
  const validExpertId = Validator.validateId(expertId);
  const validReview = Validator.validateReview(review);
  const validIListingId = Validator.validateId(listingId);
  try {
    const expertDb = await experts();
    const listingDb = await listings();
    const expertRes = await expertDb.updateOne(
      { _id: new ObjectId(validExpertId) },
      {
        $pull: { requests: new ObjectId(validIListingId) },
        $set: { updateAt: new Date().toUTCString() },
        $push: { carReviewed: new ObjectId(validIListingId) },
      }
    );
    handleUpdateError(expertRes);
    const listingRes = await listingDb.updateOne(
      {
        _id: new ObjectId(validIListingId),
      },
      {
        $set: {
          updateAt: new Date().toUTCString(),
          "mechanicReviews.0.review": validReview,
          "mechanicReviews.0.updateAt": new Date().toUTCString(),
        },
      },
      { returnDocument: "after" }
    );
    handleUpdateError(listingRes);
    return listingRes;
  } catch (e) {
    databaseExceptionHandler(e);
  }
};

const getRequestListings = async (expertId) => {
  const validExpertId = Validator.validateId(expertId);
  try {
    const listingDb = await listings();
    const res = await listingDb.find({
      "mechanicReviews.mechanicId": new ObjectId(validExpertId),
    });
    return res;
  } catch (e) {
    databaseExceptionHandler(e);
  }
};

const getRequestById = async (requestId) => {};

export { addRequest, addReview, getRequestListings };
