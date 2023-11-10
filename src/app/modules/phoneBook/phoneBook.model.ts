import { Schema, model } from "mongoose";
import { TPhoneBook, TPhoneBookModel } from "./phoneBook.interface";

const phoneBookSchema = new Schema<TPhoneBook>(
  {
    name: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },

    mess: {
      type: Schema.Types.ObjectId,
      ref: "Mess",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const PhoneBookModel = model<TPhoneBook, TPhoneBookModel>("PhoneBook", phoneBookSchema);

export default PhoneBookModel;
