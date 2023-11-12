import { RequestHandler } from "express";
import * as phoneBookService from "./phoneBook.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../ApiError";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import PhoneBookModel from "./phoneBook.model";

export const create: RequestHandler = async (req, res, next) => {
  try {
    const data = await phoneBookService.create_service(req.body, req.user);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Phone Book created successfully",
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
    const filter = filterHelper(req, new PhoneBookModel(), ["name", "phone"]);
    const { data, meta } = await phoneBookService.getAll_service(pagination, filter);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Phone Book fetched successfully",
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
    const data = await phoneBookService.getSingle_service(req.params.id);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Phone Book fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    let data = await phoneBookService.update_service(req.params.id, req.body);

    const payload = {
      success: true,
      message: "Phone Book Updated successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    const data = await phoneBookService.remove_service(req.params.id);

    const payload = {
      success: true,
      message: "Phone Book Deleted successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const removeMany: RequestHandler = async (req, res, next) => {
  try {
    const data = await phoneBookService.removeMany_service(req.body?.ids);

    const payload = {
      success: true,
      message: "Phone Book Deleted successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const getMessPhoneBook: RequestHandler = async (req, res, next) => {
  try {
    const data = await phoneBookService.getMessPhoneBook_service(req.user.mess);

    const payload = {
      success: true,
      message: "Mess Phone Book Fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};
