import { Schema, Types } from 'mongoose';

export interface IProfilePic {
  filename: string;
  mimetype: string;
  url: string;
  size: number;
  googleFileId: string;
  owner: Types.ObjectId | string;
}

export const ProfilePicModel = new Schema<IProfilePic>({
  filename: {
    type: String,
    required: [true, 'A Image must have a filename'],
    unique: true,
  },
  mimetype: String,
  url: String,
  size: Number,
  googleFileId: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});
