import { Model } from "mongoose";

export type IUser = {
  name: string;
  email: string;
  phone: string;
  role: "superAdmin" | "admin" | "manager" | "viceManager" | "member";
  password?: string;
  dateOfBirth: string;
  image: string;
};

export type UserModel = Model<IUser, Record<string, unknown>>;
