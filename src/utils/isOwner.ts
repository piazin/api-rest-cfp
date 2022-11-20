import { Types } from 'mongoose';
export const isOwner = (owner: string | Types.ObjectId, transactionId: string | Types.ObjectId) => {
  return JSON.stringify(owner) === JSON.stringify(transactionId);
};
