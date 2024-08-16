import { Router } from "express";
import {
  createPart,
  getPartById,
  searchPartsByName,
  getPartByCarId
} from "../../data/parts.js";
import { InvalidInputException } from "../../utils/exceptions.js";
import Validator from "../../utils/validator.js";
import auth, { authSafe } from "../../middleware/auth.js";

const router = Router();

router.post("/", auth, async (req, res, next) => {
  try {
    const { name, price, manufacturer, sellerId, carIds } = req.body;
    const newPart = await createPart(name, price, manufacturer, sellerId, carIds);
    res.status(201).json(newPart);
  } catch (e) {
    next(e);
  }
});

router.get("/:partId", authSafe, async (req, res, next) => {
  try {
    let partId = req.params.partId;
    if (!partId) throw new InvalidInputException("Part ID can't be null.");
    partId = Validator.validateId(partId);
    const part = await getPartById(partId);
    res.status(200).json(part);
  } catch (e) {
    next(e);
  }
});

router.get("/search", auth, async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      throw new InvalidInputException("Search query must be a non-empty string.");
    }
    const parts = await searchPartsByName(query);
    res.status(200).json(parts);
  } catch (e) {
    next(e);
  }
});

router.get("/:partId/cars", auth, async (req, res, next) => {
  try {
    const partId = req.params.partId;
    if (!partId) throw new InvalidInputException("Part ID can't be null.");
    const carsList = await getPartByCarId(partId);
    res.status(200).json(carsList);
  } catch (e) {
    next(e);
  }
});

export default router;
