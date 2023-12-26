import { Schema, model } from "mongoose";
import { TPhoneBook, TPhoneBookModel } from "./phoneBook.interface";

const phoneBookSchema = new Schema<TPhoneBook>(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mess: {
      type: Schema.Types.ObjectId,
      ref: "Mess",
      required: true,
    },

  },
  { timestamps: true }
);

const PhoneBookModel = model<TPhoneBook, TPhoneBookModel>("PhoneBook", phoneBookSchema);

export default PhoneBookModel;
