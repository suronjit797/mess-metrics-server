import { RequestHandler } from "express";
import * as bazarService from "./bazar.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../ApiError";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import BazarModel from "./bazar.model";
import { userRole } from "../../../constants/userConstants";

export const create: RequestHandler = async (req, res, next) => {
  try {
    const data = await bazarService.create_service(req.body, req.user);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Bazar created successfully",
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
    const filter = filterHelper(req, new BazarModel(), ["name"]);
    if (![userRole.admin, userRole.superAdmin].includes(req.user.role)) {
      if (!req.user.mess) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Bad request");
      }
      filter.mess = req.user.mess;
      filter.month = req.user.activeMonth;
    }

    const { data, meta } = await bazarService.getAll_service(pagination, filter);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Bazar fetched successfully",
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
    const data = await bazarService.getSingle_service(req.params.id);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Bazar fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const getLast: RequestHandler = async (req, res, next) => {
  try {
    const data = await bazarService.getLast_service(req.user);
    const payload = {
      success: true,
      message: "Last Bazar fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    let data = await bazarService.update_service(req.params.id, req.body, req.user);

    const payload = {
      success: true,
      message: "Bazar Updated successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    const data = await bazarService.remove_service(req.params.id);

    const payload = {
      success: true,
      message: "Bazar Deleted successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const removeMany: RequestHandler = async (req, res, next) => {
  try {
    const data = await bazarService.removeMany_service(req.body?.ids);

    const payload = {
      success: true,
      message: "Bazars Deleted successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};
