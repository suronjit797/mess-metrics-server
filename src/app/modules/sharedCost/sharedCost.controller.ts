import { RequestHandler } from "express";
import * as sharedCostService from "./sharedCost.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../ApiError";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import SharedCostModel from "./sharedCost.model";
import { userRole } from "../../../constants/userConstants";

export const create: RequestHandler = async (req, res, next) => {
  try {
    const data = await sharedCostService.create_service(req.body, req.user);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Shared Cost created successfully",
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
    const filter = filterHelper(req, new SharedCostModel(), ["name"]);
    if (![userRole.admin, userRole.superAdmin].includes(req.user.role)) {
      if (!req.user.mess) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Bad request");
      }
      filter.mess = req.user.mess;
      filter.month = req.user.activeMonth;
    }

    const { data, meta } = await sharedCostService.getAll_service(pagination, filter);
    const payload = {
      success: true,
      message: "Shared Cost fetched successfully",
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
    const data = await sharedCostService.getSingle_service(req.params.id);
    const payload = {
      success: true,
      message: "Shared Cost fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const getLast: RequestHandler = async (req, res, next) => {
  try {
    const data = await sharedCostService.getLast_service(req.user);
    const payload = {
      success: true,
      message: "Last Shared Cost fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    let data = await sharedCostService.update_service(req.params.id, req.body, req.user);

    const payload = {
      success: true,
      message: "Shared Cost Updated successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    const data = await sharedCostService.remove_service(req.params.id);

    const payload = {
      success: true,
      message: "Shared Cost Deleted successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const removeMany: RequestHandler = async (req, res, next) => {
  try {
    const data = await sharedCostService.removeMany_service(req.body?.ids);

    const payload = {
      success: true,
      message: "Shared Costs Deleted successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};
