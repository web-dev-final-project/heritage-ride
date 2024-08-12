import { ObjectId } from "mongodb";
import { handleAddError, handleUpdateError } from "../utils/databaseUtil.js";
import {
  databaseExceptionHandler,
  NotFoundException,
} from "../utils/exceptions.js";
import Validator from "../utils/validator.js";
import { listings, transactions } from "./init.js";

const listingLookUp = [
  {
    $lookup: {
      from: "listings",
      localField: "listingId",
      foreignField: "_id",
      as: "listing",
    },
  },
  {
    $unwind: "$listing",
  },
];

const getTransactionBySeller = async (userId) => {
  try {
    const validId = Validator.validateId(userId);
    const transactionDb = await transactions();
    return await transactionDb.findOne({ sellerId: new ObjectId(validId) });
  } catch (e) {
    databaseExceptionHandler(e);
  }
};
const getTransactionByBuyer = async (userId) => {
  try {
    const validId = Validator.validateId(userId);
    const transactionDb = await transactions();
    return await transactionDb.findOne({ buyerId: new ObjectId(validId) });
  } catch (e) {
    databaseExceptionHandler(e);
  }
};

const createTransaction = async (transc) => {
  try {
    const validTransc = Validator.validateTransaction(transc);
    const transactionDb = await transactions();
    const listingsDb = await listings();
    const listing = await listingsDb.findOneAndUpdate(
      { _id: new ObjectId(validTransc.listingId) },
      {
        $set: {
          status: "reserved",
          updatedAt: new Date().toUTCString(),
        },
      },
      { returnDocument: "after" }
    );
    const transaction = await transactionDb.insertOne({
      listingId: new ObjectId(validTransc.listingId),
      sellerId: listing.sellerId,
      buyerId: new ObjectId(validTransc.buyerId),
      status: "pending",
      amount: validTransc.amount,
      paymentStatus: validTransc.paymentStatus,
      payment: validTransc.payment,
      createdAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
    });
    handleAddError(transaction);
    return transaction.insertedId;
  } catch (e) {
    databaseExceptionHandler(e);
  }
};

const completeTransaction = async (transId) => {
  try {
    const validId = Validator.validateId(transId);
    const transactionDb = await transactions();
    const listingsDb = await listings();
    const transaction = await transactionDb.updateOne(
      { _id: new ObjectId(validId) },
      {
        $set: {
          status: "complete",
          updatedAt: new Date().toUTCString(),
        },
      }
    );
    handleUpdateError(transaction);
    const listing = await listingsDb.updateOne(
      { _id: new ObjectId(transaction.listingId) },
      {
        $set: {
          status: "sold",
          updatedAt: new Date().toUTCString(),
        },
      }
    );
    handleUpdateError(listing);
    return;
  } catch (e) {
    databaseExceptionHandler(e);
  }
};

const userLookUp = [
  {
    $lookup: {
      from: "users",
      localField: "buyerId",
      foreignField: "_id",
      as: "buyer",
    },
  },
  {
    $unwind: "$buyer",
  },
  {
    $project: {
      "buyer.password": 0,
    },
  },
];
const getTransactionByListingId = async (id) => {
  try {
    const validId = Validator.validateId(id);
    const transactionDb = await transactions();
    const res = await transactionDb
      .aggregate([
        {
          $match: {
            listingId: new ObjectId(validId),
          },
        },
        ...userLookUp,
        ...listingLookUp,
      ])
      .toArray();
    if (res.length === 0) throw new NotFoundException("no transaction found");
    return res[0];
  } catch (e) {
    databaseExceptionHandler(e);
  }
};

export {
  completeTransaction,
  createTransaction,
  getTransactionByBuyer,
  getTransactionBySeller,
  getTransactionByListingId,
};
