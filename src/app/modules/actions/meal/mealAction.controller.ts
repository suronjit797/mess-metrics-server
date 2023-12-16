import { RequestHandler } from "express";
import * as actionService from "./mealActions.service";
import sendResponse from "../../../../shared/sendResponse";
import httpStatus from "http-status";


export const addMeal: RequestHandler = async (req, res, next) => {
  try {
    const data = await actionService.addMeal_service(req.body, req.user);
    const payload = {
      success: true,
      message: "Meal Add successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const getMealByDate: RequestHandler = async (req, res, next) => {
  const { date } = req.query;
  try {
    const data = await actionService.getMealByDate_Service(req.user, date as string);
    const payload = {
      success: true,
      message: "Meal fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const updateMeal: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await actionService.updateMeal_Service(id, req.body);
    const payload = {
      success: true,
      message: "Meal Updated successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};
