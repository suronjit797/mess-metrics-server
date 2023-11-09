import httpStatus from "http-status";
import ApiError from "../../../ApiError";
import config from "../../../config";
import { paginationHelper } from "../../../helper/paginationHelper";
import { IUser } from "./user.interface";
import UserModel from "./user.model";
import bcrypt from "bcrypt";
import { generateUserId } from "./user.utils";
import jwt from "jsonwebtoken";
import { IPagination } from "../../../shared/globalInterfaces";

type LoginPayload = {
  email: string;
  password: string;
};
type LoginRes = { accessToken: string; refreshToken: string };

// auth
export const createUserService = async (user: IUser): Promise<IUser | null> => {
  const isExist = await UserModel.findOne({ email: user.email });
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
  }

  if (!user.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is required");
  }

  const password = await bcrypt.hash(user.password, bcrypt.genSaltSync(config.sault_round));
  const userData = { ...user, password };

  const newUser = await UserModel.create(userData);
  return newUser;
};

export const loginService = async (payload: LoginPayload): Promise<LoginRes> => {
  const isExist = await UserModel.findOne({ email: payload.email });
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User and password not matched");
  }

  const match = await bcrypt.compare(payload.password, isExist.password as string);
  console.log({ match });

  if (!match) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User and password not matched");
  }

  const accessToken = jwt.sign({ userId: isExist._id }, config.token.access_token_secret, {
    expiresIn: config.token.access_token_time,
  });
  const refreshToken = jwt.sign({ userId: isExist._id }, config.token.refresh_token_secret, {
    expiresIn: config.token.refresh_token_time,
  });

  return {
    accessToken,
    refreshToken,
  };
};
export const getProfile_service = async (id: string): Promise<IUser | null> => {
  const data = await UserModel.findById(id).select({ password: 0 });
  return data;
};

// user
export const getAll_service = async (pagination: IPagination, filter: any): Promise<any> => {
  const { page, limit, skip, sortCondition } = pagination;
  const data = await UserModel.find(filter).limit(limit).skip(skip).sort(sortCondition).select({ password: 0 });
  const total = await UserModel.countDocuments(filter);
  return { data, meta: { page, limit, total } };
};
export const getSingle_service = async (id: string): Promise<IUser | null> => {
  const data = await UserModel.findById(id).select({ password: 0 });
  return data;
};
export const update_service = async (id: string, payload: IUser): Promise<IUser | null> => {
  const data = await UserModel.findByIdAndUpdate(id, payload, { new: true });
  return data;
};
export const remove_service = async (id: string): Promise<IUser | null> => {
  const data = await UserModel.findByIdAndDelete(id);
  return data;
};
