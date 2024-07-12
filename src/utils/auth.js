import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AuthenticationException } from "./exceptions";

const JWT_SECRET = process.env.SERVER_SECRET;

const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

const verifyToken = (token) => {
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      throw new AuthenticationException("User is not logged in.");
    }
    return decoded;
  });
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export { generateToken, comparePassword, hashPassword, verifyToken };
