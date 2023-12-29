import { RequestHandler } from "express";
import * as monthService from "./month.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../ApiError";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import MonthModel from "./month.model";

export const create: RequestHandler = async (req, res, next) => {
  try {
    const data = await monthService.create_service(req.body, req.user);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Month created successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const pagination = paginationHelper(req.query);
    const filter = filterHelper(req, new MonthModel(), ["name"]);
    const { data, meta } = await monthService.getAll_service(pagination, filter);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Month fetched successfully",
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
    const data = await monthService.getSingle_service(req.params.id);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Month fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    const Month = await MonthModel.findById(req.params.id);

    let data = await monthService.update_service(req.params.id, req.body);

    const payload = {
      success: true,
      message: "Month Updated successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    const data = await monthService.remove_service(req.params.id);

    const payload = {
      success: true,
      message: "Month Deleted successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const removeMany: RequestHandler = async (req, res, next) => {
  try {
    const data = await monthService.removeMany_service(req.body?.ids);

    const payload = {
      success: true,
      message: "Month Deleted successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const getMessMonth: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?.mess) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User is not in a mess");
    }

    const pagination = paginationHelper(req.query);
    const filter = filterHelper(req, new MonthModel(), ["name"]);

    filter.mess = req.user.mess;
    filter.user = req.query.userId || req.user.userId;

    console.log(filter);

    // const data = await monthService.getMessMonth_service(req.user?.mess);
    const { data, meta } = await monthService.getMessMonth_service(filter, pagination);

    const payload = {
      success: true,
      message: "mess Month list fetched successfully",
      data,
      meta,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const getMessActiveMonth: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?.mess) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User is not in a mess");
    }
    const data = await monthService.getMessActiveMonth_service(req.user?.mess);

    const payload = {
      success: true,
      message: "mess Month fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const switchActiveMonth: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user?.mess) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User is not in a mess");
    }
    const data = await monthService.switchActiveMonth_service(req.params.id, req.user.userId);

    const payload = {
      success: true,
      message: "Month switched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};
