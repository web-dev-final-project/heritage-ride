import logger from "../utils/logger";

function error(err, req, res, next) {
  logger.error(err.stack);
  next();
}

export default error;
