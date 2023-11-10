import { Model, ObjectId } from "mongoose";

export type TPhoneBook = {
  name: string;
  phone: string;
  mess: ObjectId;
  user: ObjectId;
};

export type TPhoneBookModel = Model<TPhoneBook, Record<string, unknown>>;
