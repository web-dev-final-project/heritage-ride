import { AuthenticationException } from "../utils/exceptions.js";
import { verifyToken } from "../utils/auth.js";

const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new AuthenticationException("User has not yet logged in.");
  }
  req.user = verifyToken(token).user;
  next();
};

export default auth;
