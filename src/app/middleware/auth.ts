import { RequestHandler } from "express";
import httpStatus from "http-status";
import config from "../../config";
import { CustomJwtPayload } from "../../shared/globalInterfaces";
import ApiError from "../../ApiError";
import { userRole } from "../../constants/userConstants";
import jwt from "jsonwebtoken";
import UserModel from "../modules/user/user.model";

export const auth =
  (...roles: string[]): RequestHandler =>
  async (req, res, next) => {
    const roleNames = [...roles, userRole.superAdmin];
    try {
      const token = req.headers.authorization;
      if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, "you are not authorized");

      const decoded = jwt.verify(token, config.token.access_token_secret) as CustomJwtPayload;

      const isExist = await UserModel.findById(decoded.userId);



      if (!isExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Invalid user`);
      }

      if (roles.length > 0 && !roleNames.includes(isExist.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, `Unauthorized Access`);
      }

      const user = isExist.toJSON()


      req.user = { userId: decoded.userId, ...user };
      next();
    } catch (error) {
      next(error);
    }
  };
