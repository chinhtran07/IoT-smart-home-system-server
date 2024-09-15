const jwt = require("jsonwebtoken");
const config = require("../config");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer")
      ? authHeader.split(" ")[1]
      : null;

  if (token == null) next(new Error("Missing token"));
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new Error("Forbidden");
    }
    next();
  };
};

module.exports = { authenticate, authorize };
