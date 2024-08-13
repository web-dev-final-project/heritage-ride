import { ObjectId } from "mongodb";
import { handleAddError, handleUpdateError } from "../utils/databaseUtil";
import { databaseExceptionHandler } from "../utils/exceptions";
import Validator from "../utils/validator";
import { listings, transactions } from "./init";

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
    const listing = await listingsDb.updateOne(
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
      sellerId: new ObjectId(listing.sellerId),
      buyerId: new ObjectId(validTransc.buyerId),
      status: "pending",
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
      },
      { returnDocument: "after" }
    );
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

export {
  completeTransaction,
  createTransaction,
  getTransactionByBuyer,
  getTransactionBySeller,
};
