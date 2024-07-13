import * as users from "../../data/users.js";
import { Router } from "express";
import Validator from "../../utils/validator.js";
import {
  AuthenticationException,
  InvalidInputException,
  NotFoundException,
} from "../../utils/exceptions.js";
import { Role } from "../../utils/extend.js";
import { HttpResponse } from "../../utils/class.js";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../../utils/auth.js";

const router = Router();

router.post("/signup", async (req, res, next) => {
  try {
    let user = req.body;
    user = Validator.validateUser(user);
    user.role = ["user"];
    const exist = await users.findUserByEmailOrUserName(
      user.email,
      user.userName
    );
    if (exist) throw new InvalidInputException("User has already exist");

    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;
    const resp = await users.createUser(user);
    res.status(201).send(new HttpResponse(user));
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    let user = req.body;
    let id = req.params.id;
    user = Validator.validateUser(user);
    id = Validator.validateId(id);
    const resp = await users.updateUser({ ...user, id });
    if (!resp) throw new NotFoundException(`Provided user not found`);
    res.status(200).send(resp);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    id = Validator.validateId(id);
    const resp = await users.findUser(id);
    if (!resp) throw new NotFoundException(`user not found`);
    res.status(200).send(resp);
  } catch (e) {
    next(e);
  }
});

router.post("/role/:id", async (req, res, next) => {
  try {
    let role = req.body;
    let id = req.params.id;
    id = Validator.validateId(id);
    role.role = role.checkObject().role.checkString();
    if (!Role.containsValue(role.role))
      throw new InvalidInputException("Role must be seller or expert");
    const resp = await users.addRole(id, role.role);
    if (!resp) throw new NotFoundException(`Provided user not found`);
    res.status(200).send(resp);
  } catch (e) {
    next(e);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    let { userName, password } = req.body;
    password = password.checkString();
    let resp;
    resp = await users.findUserByEmailOrUserName(userName, userName);
    if (!resp) throw new NotFoundException(`Provided user not found`);
    const checkPass = await comparePassword(password, resp.password);
    if (!checkPass)
      throw new AuthenticationException("Invalid username or password.");
    delete resp.password;
    const token = generateToken(resp);
    res.status(200).send(new HttpResponse(token));
  } catch (e) {
    next(e);
  }
});

export default router;
