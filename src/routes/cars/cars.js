import * as users from "../../data/users.js";
import { Router } from "express";
import Validator from "../../utils/validator.js";
import {
  AuthenticationException,
  InvalidInputException,
  NotFoundException,
} from "../../utils/exceptions.js";
import { Role } from "../../utils/extend.js";
import { HttpResponse, HttpStatus } from "../../utils/class.js";
import { getApiRoutes } from "../index.js";
import auth from "../../middleware/auth.js";
import { getCars } from "../../data/cars.js";

const router = Router();

router.get("/", auth, async (req, res, next) => {
  try {
    const cars = await getCars();
    res.status(200).send(new HttpResponse(cars, HttpStatus.SUCCESS));
  } catch (e) {
    next(e);
  }
});

export default router;
