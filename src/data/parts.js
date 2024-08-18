import { parts, listings } from "./init.js";
import { ObjectId } from "mongodb";
import { DataBaseException, NotFoundException } from "../utils/exceptions.js";
import { createListing } from "./listings.js";
import Validator from "../utils/validator.js"; // Ensure this import is correct

const createPart = async (name, description, tag, sellerId, carIds) => {
  const newPart = {
    name,
    description,
    tag,
    sellerId: new ObjectId(sellerId),
    carIds: carIds.map((id) => new ObjectId(id)),
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString(),
  };

  try {
    const partsCollection = await parts();
    const { acknowledged, insertedId } = await partsCollection.insertOne(
      newPart
    );

    if (!acknowledged || !insertedId) {
      throw new Error("Could not add Part");
    }

    await createListing(sellerId, {
      itemId: insertedId.toString(),
      title: name,
    });

    return await getPartById(insertedId.toString());
  } catch (e) {
    throw new DataBaseException(e);
  }
};

const getPartById = async (partId) => {
  try {
    const validId = Validator.validateId(partId);
    const partsCollection = await parts();
    const part = await partsCollection
      .aggregate([
        {
          $match: { _id: new ObjectId(validId) },
        },
        {
          $lookup: {
            from: "cars",
            let: { carIds: "$carId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $in: ["$_id", "$$carIds"],
                  },
                },
              },
            ],
            as: "car",
          },
        },
      ])
      .toArray();
    if (!part) {
      throw new NotFoundException("Part not found");
    }
    return part[0];
  } catch (e) {
    throw new DataBaseException(e);
  }
};

const getParts = async () => {
  try {
    const partsCollection = await parts();
    return await partsCollection.find({}).toArray();
  } catch (e) {
    throw new DataBaseException(e);
  }
};

const searchPartsByName = async ({ query, tag }) => {
  try {
    const partsCollection = await parts();
    const matchConditions = {};

    if (query) {
      matchConditions["name"] = { $regex: new RegExp(query, "i") };
    }
    if (tag) {
      matchConditions["tag"] = tag;
    }

    const result = await partsCollection.find(matchConditions).toArray();
    return result;
  } catch (e) {
    throw new DataBaseException(e);
  }
};

export { createPart, getPartById, getParts, searchPartsByName };
