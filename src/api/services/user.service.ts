import { model } from 'mongoose';
import Joi from 'joi';
import { UserSchema } from '../models/User';
import { ProfilePicSchema, IProfilePic } from '../models/ProfilePic';
import { IUser } from '../models/User';
import { uploadFileGoogleDrive, deleteFileGoogleDrive } from '../../utils/googleDriveApi';
import constantsUser from '../../constants/user.constants';
import { isIdValid } from '../../utils/isIdValid';

const User = model('user', UserSchema);
const ProfilePic = model('profilepic', ProfilePicSchema);

const {
  err: { invalidUser, invalidGoogleFileId },
} = constantsUser;

export class userService {
  async findOneUserByID(user_id: string) {
    var response: IUser = await User.findOne({ _id: user_id });
    if (!response) return {};

    var avatar = await ProfilePic.findOne({ owner: user_id });
    response.avatar = avatar;

    response.transactions = `http://localhost:8080/api/v1/transaction/${response._id}`;

    return response;
  }

  async createUser(user: IUser) {
    const schemaValidation = Joi.object({
      email: Joi.string().required(),
      name: Joi.string().min(1).required(),
      password: Joi.string().min(6).required(),
    }).error(new Error('all fields required'));

    await schemaValidation.validateAsync(user);

    const findUser = await User.findOne({ email: user.email });
    if (findUser) throw new Error('Usuário já cadastrado');

    var response = await User.create(user);

    return response;
  }

  async signInUser(email: string, password: string) {
    var user = await User.findOne({ email: email });

    if (!user) throw new Error('Usuário não encotrado');

    if (!(await user.compareHash(password))) throw new Error('E-mail ou senha incorreta');

    var profilePic = await ProfilePic.findOne({ owner: user._id });
    user.avatar = profilePic;

    const token = user.generateJwt();

    const { _id, name, avatar, created_at } = user;
    return {
      _id,
      name,
      email,
      avatar,
      created_at,
      token,
    };
  }

  async uploadProfilePic(owner: string, avatar: any) {
    if (!isIdValid(owner)) throw new Error(invalidUser);
    const profilePicExists = await ProfilePic.findOne({ owner: owner });

    if (profilePicExists) {
      await deleteFileGoogleDrive(profilePicExists.googleFileId);
      await profilePicExists.delete();
    }

    avatar.owner = owner;

    const { fieldname, destination, encoding, path, ...rest } = avatar;
    const avatarFilter: IProfilePic = {
      ...rest,
      url: path,
    };

    var response = await uploadFileGoogleDrive(avatarFilter);
    avatarFilter.url = `https://drive.google.com/uc?export=view&id=${response.id}`;
    avatarFilter.googleFileId = response.id;

    return await ProfilePic.create(avatarFilter);
  }

  async deleteProfilePic(fileId: string) {
    if (!fileId) throw new Error(invalidGoogleFileId);

    const response = await deleteFileGoogleDrive(fileId);
    return response;
  }
}
