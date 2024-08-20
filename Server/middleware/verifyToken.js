import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthenticateRepository } from "../repository/index.js";
const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res
        .status(401)
        .json({ error: "No cookie for accessToken was provided" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.decodedToken = decodedToken;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Verify token expired, go to sign in page to send new email",
      });
    }
    return res.status(500).json({ error: error.message });
  }
};
export default verifyToken;
