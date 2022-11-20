import { Types } from "mongoose";
export const isIdValid = (id: string) => Types.ObjectId.isValid(id);
