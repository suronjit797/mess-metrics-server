import { RequestHandler } from "express";
import * as mealService from "./meal.service";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../../ApiError";
import httpStatus from "http-status";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import MealModel from "./meal.model";
import { userRole } from "../../../constants/userConstants";

export const getAll: RequestHandler = async (req, res, next) => {
  try {
    const pagination = paginationHelper(req.query);
    const filter = filterHelper(req, new MealModel(), ["name"]);

    // ! hare mess filter is done where only superAdmin and admin are allowed to get all data
    if (![userRole.admin, userRole.superAdmin].includes(req.user.role)) {
      if (!req.user.mess) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Bad request");
      }
      filter.mess = req.user.mess;
    }

    const data = await mealService.getAll_service(pagination, filter);

    const payload = {
      success: true,
      message: "Meal Data fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const create: RequestHandler = async (req, res, next) => {
  try {
    const data = await mealService.create_service(req.user, req.body);

    const payload = {
      success: true,
      message: "Meal added successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const getSingle: RequestHandler = async (req, res, next) => {
  try {
    const data = await mealService.getSingle_service(req.user, req.params.id);

    const payload = {
      success: true,
      message: "Meal Data fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const updateMeal: RequestHandler = async (req, res, next) => {
  try {
    const data = await mealService.updateMeal_service(req.user, req.body);

    const payload = {
      success: true,
      message: "Meal Data updated successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};


export const removeSingle: RequestHandler = async (req, res, next) => {
  try {
    const data = await mealService.removeSingle_service(req.user, req.params.id);

    const payload = {
      success: true,
      message: "Meal removed successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const removeMulti: RequestHandler = async (req, res, next) => {
  try {
    const data = await mealService.removeMulti_service(req.user, req.body.ids);

    const payload = {
      success: true,
      message: "Meal  removed successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};
