import { RequestHandler } from "express";
import * as depositService from "./deposit.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../ApiError";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import DepositModel from "./deposit.model";
import { userRole } from "../../../constants/userConstants";

export const create: RequestHandler = async (req, res, next) => {
  try {
    const data = await depositService.create_service(req.body, req.user);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Deposit created successfully",
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
    const filter = filterHelper(req, new DepositModel(), ["name"]);
    if (![userRole.admin, userRole.superAdmin].includes(req.user.role)) {
      if (!req.user.mess) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Bad request");
      }
      filter.mess = req.user.mess;
      filter.month = req.user.activeMonth;
    }


    const { data, meta } = await depositService.getAll_service(pagination, filter);
    const payload = {
      success: true,
      message: "Deposit fetched successfully",
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
    const data = await depositService.getSingle_service(req.params.id);
    const payload = {
      success: true,
      message: "Deposit fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    let data = await depositService.update_service(req.params.id, req.body);

    const payload = {
      success: true,
      message: "Deposit Updated successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    const data = await depositService.remove_service(req.params.id);

    const payload = {
      success: true,
      message: "Deposit Deleted successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const removeMany: RequestHandler = async (req, res, next) => {
  try {
    const data = await depositService.removeMany_service(req.body?.ids);

    const payload = {
      success: true,
      message: "Deposits Deleted successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};
