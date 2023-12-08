import { RequestHandler } from "express";
import * as actionService from "./actions.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../ApiError";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";


export const addMeal: RequestHandler = async (req, res, next) => {
  try {
    const data = await actionService.addMeal_service(req.body, req.user)
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
