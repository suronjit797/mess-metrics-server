import { CustomJwtPayload, IPagination } from "../../../shared/globalInterfaces";

import ApiError from "../../../ApiError";
import httpStatus from "http-status";
import moment from "moment";
import { JwtPayload } from "jsonwebtoken";
import UserModel from "../user/user.model";
import { userRole } from "../../../constants/userConstants";
import PhoneBookModel from "../phoneBook/phoneBook.model";

export const createMonth_service = async (): Promise<any> => {
  try {


  } catch (error) {

    throw new Error(error as "string | undefined");
  }
};

