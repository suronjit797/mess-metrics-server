import { RequestHandler } from "express";
import * as notificationsService from "./notifications.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../ApiError";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import NotificationsModel from "./notifications.model";
import { userRole } from "../../../constants/userConstants";

export const create: RequestHandler = async (req, res, next) => {
  try {
    const data = await notificationsService.create_service(req.body, req.user);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Notification created successfully",
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
    const filter = filterHelper(req, new NotificationsModel(), ["message"]);
    if (![userRole.admin, userRole.superAdmin].includes(req.user?.role)) {
      if (!req.user.mess) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Bad request");
      }
      filter.mess = req.user.mess;
      // filter.month = req.user.activeMonth;
      filter.user = req.user.userId;
    }

    const { data, meta, unread } = await notificationsService.getAll_service(pagination, filter);
    const payload = {
      success: true,
      message: "Notifications fetched successfully",
      meta,
      unread,
      data,
    };
    // return sendResponse(res, httpStatus.OK, payload);
    return res.status(httpStatus.OK).send(payload);
  } catch (error) {
    next(error);
  }
};

export const getSingle: RequestHandler = async (req, res, next) => {
  try {
    const data = await notificationsService.getSingle_service(req.params.id);
    const payload = {
      success: true,
      message: "Notification fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    let data = await notificationsService.update_service(req.params.id, req.body);

    const payload = {
      success: true,
      message: "Notification Updated successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    const data = await notificationsService.remove_service(req.params.id);

    const payload = {
      success: true,
      message: "Notification Deleted successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const removeMany: RequestHandler = async (req, res, next) => {
  try {
    const data = await notificationsService.removeMany_service(req.body?.ids);

    const payload = {
      success: true,
      message: "Notifications Deleted successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const readAll: RequestHandler = async (req, res, next) => {
  try {
    const filter: any = {};
    filter.mess = req.user.mess;
    // filter.month = req.user.activeMonth;
    filter.user = req.user.userId;

    const data = await notificationsService.readAll_service(filter);
    const payload = {
      success: true,
      message: "Notifications read all successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};
