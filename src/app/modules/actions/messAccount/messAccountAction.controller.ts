import { RequestHandler } from "express";
import * as messAccountService from "./messAccountAction.service";
import sendResponse from "../../../../shared/sendResponse";
import httpStatus from "http-status";

export const getMessAccount: RequestHandler = async (req, res, next) => {
  try {
    const data = await messAccountService.getMessAccount_service(req.user);
    const payload = {
      success: true,
      message: "Mess Account get Successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const addTotalMealCost: RequestHandler = async (req, res, next) => {
  try {
    const data = await messAccountService.addTotalMealCost_service(req.user, req.params.id as string, req.body);
    const payload = {
      success: true,
      message: "Mess Account Updated Successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};
