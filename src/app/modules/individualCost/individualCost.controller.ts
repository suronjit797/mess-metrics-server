import { RequestHandler } from "express";
import * as individualCostService from "./individualCost.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../ApiError";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import IndividualCostModel from "./individualCost.model";
import { userRole } from "../../../constants/userConstants";

export const create: RequestHandler = async (req, res, next) => {
  try {
    const data = await individualCostService.create_service(req.body, req.user);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Individual Cost created successfully",
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
    const filter = filterHelper(req, new IndividualCostModel(), ["name"]);

    if (![userRole.admin, userRole.superAdmin].includes(req.user.role)) {
      if (!req.user.mess) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Bad request");
      }
      filter.mess = req.user.mess;
      filter.month = req.user.activeMonth;
    }


    console.log(filter)

    const { data, meta } = await individualCostService.getAll_service(pagination, filter);
    const payload = {
      success: true,
      message: "Individual Cost fetched successfully",
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
    const data = await individualCostService.getSingle_service(req.params.id);
    const payload = {
      success: true,
      message: "Individual Cost fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const getLast: RequestHandler = async (req, res, next) => {
  try {
    const data = await individualCostService.getLast_service(req.user);
    const payload = {
      success: true,
      message: "Last Individual Cost fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    let data = await individualCostService.update_service(req.params.id, req.body);

    const payload = {
      success: true,
      message: "Individual Cost Updated successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    const data = await individualCostService.remove_service(req.params.id);

    const payload = {
      success: true,
      message: "Individual Cost Deleted successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const removeMany: RequestHandler = async (req, res, next) => {
  try {
    const data = await individualCostService.removeMany_service(req.body?.ids);

    const payload = {
      success: true,
      message: "Individual Costs Deleted successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};
