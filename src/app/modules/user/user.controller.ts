import { RequestHandler } from "express";
import * as userService from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import { TPayload } from "../../../interfaces/responseInterface";
import httpStatus from "http-status";
import { TUser } from "./user.interface";
import pic from "../../../shared/pick";
import { paginationOptionArr } from "../../../constants/pagination";
import ApiError from "../../../ApiError";
import config from "../../../config";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import TUserModel from "./user.model";
import { userRole } from "../../../constants/userConstants";

// auth
export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.createUserService(req.body);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User Create Failed");
    }

    data.password = undefined;

    const payload = {
      success: true,
      message: "User created successfully",
      data,
    };
    return sendResponse(res, httpStatus.CREATED, payload);
  } catch (error) {
    next(error);
  }
};

export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.loginService(req.body);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User Create Failed");
    }

    const { accessToken, refreshToken } = data;

    const cookieOptions = {
      secure: config.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(httpStatus.OK).send({
      success: true,
      message: "User login successfully",
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.getProfile_service(req.user.userId);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "User fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

// user
export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const pagination = paginationHelper(req.query);
    const filter = filterHelper(req, new UserModel(), ["name", "email"]);
    const { data, meta } = await userService.getAll_service(pagination, filter);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Users fetched successfully",
      meta,
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const getSingle: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.getSingle_service(req.params.id);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "User fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);

    let data;

    if (req.user.role === userRole.admin || req.user.role === userRole.superAdmin || user) {
      data = await userService.update_service(req.params.id, req.body);
    } else {
      throw new ApiError(httpStatus.UNAUTHORIZED, "You are not allowed to perform this action");
    }

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "User Updated successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.remove_service(req.params.id);

    const payload = {
      success: true,
      message: "User Deleted successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};
