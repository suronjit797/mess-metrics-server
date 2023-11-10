import { RequestHandler } from "express";
import * as messService from "./bazar.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../../ApiError";
import { paginationHelper } from "../../../helper/paginationHelper";
import filterHelper from "../../../helper/filterHelper";
import MessModel from "./bazar.model";

export const create: RequestHandler = async (req, res, next) => {
  try {
    const data = await messService.create_service(req.body, req.user);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Mess created successfully",
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
    const filter = filterHelper(req, new MessModel(), ["name"]);
    const { data, meta } = await messService.getAll_service(pagination, filter);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Mess fetched successfully",
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
    const data = await messService.getSingle_service(req.params.id);

    if (!data) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server Error");
    }

    const payload = {
      success: true,
      message: "Mess fetched successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  try {
    const Mess = await MessModel.findById(req.params.id);

    let data = await messService.update_service(req.params.id, req.body);

    const payload = {
      success: true,
      message: "Mess Updated successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    const data = await messService.remove_service(req.params.id);

    const payload = {
      success: true,
      message: "Mess Deleted successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const removeMany: RequestHandler = async (req, res, next) => {
  try {
    const data = await messService.removeMany_service(req.body?.ids);

    const payload = {
      success: true,
      message: "Mess Deleted successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const removeMembers: RequestHandler = async (req, res, next) => {
  try {
    const data = await messService.removeMember_service(req.params.id, req.body?.ids);

    const payload = {
      success: true,
      message: "Member remove successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};

export const addMembers: RequestHandler = async (req, res, next) => {
  try {
    const data = await messService.addMember_service(req.params.id, req.body);

    const payload = {
      success: true,
      message: "Member add successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};
export const changeManager: RequestHandler = async (req, res, next) => {
  const { managerId, newManagerId } = req.body;
  try {
    const data = await messService.changeManager_service(req.params.id, managerId, newManagerId);

    const payload = {
      success: true,
      message: "Manager changed successfully",
      data,
    };
    return sendResponse(res, httpStatus.OK, payload);
  } catch (error) {
    next(error);
  }
};
