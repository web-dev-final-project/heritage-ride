import { MongoClient } from "mongodb";
import { mongoConfig } from "../settings.js";
import logger from "../utils/logger.js";
import { DataBaseException } from "../utils/exceptions.js";

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  if (!_connection) {
    try {
      _connection = await MongoClient.connect(mongoConfig.serverUrl);
      _db = _connection.db(mongoConfig.database);
      logger.info(`Successfully connected to mongodb...`);
    } catch (e) {
      throw new DataBaseException(
        "Failed to connect to database, please contact admin."
      );
    }
  }

  return _db;
};
const closeConnection = async () => {
  await _connection.close();
};

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

const users = getCollectionFn("users");
const cars = getCollectionFn("cars");
const parts = getCollectionFn("parts");
const listings = getCollectionFn("listings");

export { users, parts, cars, listings, dbConnection, closeConnection };
