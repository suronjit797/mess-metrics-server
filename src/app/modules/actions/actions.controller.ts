import { RequestHandler } from "express";
import * as actionsService from "./actions.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

export const getMessAccount: RequestHandler = async (req, res, next) => {
  try {
    const data = await actionsService.getMessAccount_service(req.user);
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

export const getUserAccount: RequestHandler = async (req, res, next) => {
  const { userId, monthId } = req.query;

  try {
    const data = await actionsService.getMembersAccount_service(req.user, { userId, monthId } as {
      userId: string;
      monthId: string;
    });
    const payload = {
      success: true,
      message: "Member Account get Successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};
