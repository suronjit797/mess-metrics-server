import { RequestHandler } from "express";
import * as messService from "./actions.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../ApiError";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";


export const createMonth: RequestHandler = async (req, res, next) => {
  try {
    const payload = {
      success: true,
      message: "New Month created successfully",
      // data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};
