import { handleError } from "./error.js"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(handleError(401, "Unthorized"));

  jwt.verify(token, process.env.JWT_SECRECT, (err, user) => {
    if (err) return next(handleError(403, "Forbbien"));
    req.user = user;

    next();
  })
}