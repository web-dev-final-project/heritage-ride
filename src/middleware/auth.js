import { AuthenticationException } from "../utils/exceptions.js";
import { generateToken, verifyToken } from "../utils/auth.js";

const auth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new AuthenticationException("User has not yet logged in.");
  }
  const decode = verifyToken(token);
  // @ts-ignore
  if (!decode) {
    throw new AuthenticationException("Invalid Token.");
  }
  // @ts-ignore
  req.user = decode.user;
  req.refreshToken = (user) => {
    // @ts-ignore
    const token = generateToken(user || decode.user);
    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
  };
  next();
};

const authSafe = (req, res, next) => {
  const token = req.cookies?.token;
  let decode;
  if (token) {
    decode = verifyToken(token);
    // @ts-ignore
    if (decode) {
      // @ts-ignore
      req.user = decode.user;
    }
  }
  next();
};

export default auth;
export { authSafe };
