import { Model } from "mongoose";

export type TUser = {
  name: string;
  email: string;
  phone: string;
  role: "superAdmin" | "admin" | "manager" | "viceManager" | "member";
  password?: string;
  dateOfBirth: string;
  image: string;
};

export type TUserModel = Model<TUser, Record<string, unknown>>;
