import { Model, ObjectId } from "mongoose";
import { objectUtil } from "zod";

export type meal = { id: string; meal: number };

export type TMeal = {
  _id?: ObjectId;
  date: string;
  mess: ObjectId;
  activeMonth: ObjectId;
  meal: number;
  user: ObjectId;
};

export type TMealModel = Model<TMeal, Record<string, unknown>>;

export type TMealBody = {
  user: string;
  meal: number;
};
export type TCreateMealPayload = {
  date: string;
  meals: TMealBody[];
};
