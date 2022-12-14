import { model } from 'mongoose';
import Joi from 'joi';

import { User, IUser } from '../models/User';
import TokenService from './token.service';
import { ProfilePicSchema, IProfilePic } from '../models/ProfilePic';

import constantsUser from '../../constants/user.constants';

import { uploadFileGoogleDrive, deleteFileGoogleDrive } from '../../utils/googleDriveApi';
import { isIdValid } from '../../utils/isIdValid';

const ProfilePic = model('Profilepic', ProfilePicSchema);

const { isCodeChecked, setCodeUsed } = new TokenService();

const {
  err: { invalidUser, invalidGoogleFileId, userNotFound },
} = constantsUser;

export class userService {
  async findOneUserByID(user_id: string) {
    var response: IUser = await User.findOne({ _id: user_id }).select('-password -__v');
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

    var userCreated = await User.create(user);
    var token = userCreated.generateJwt();

    const { _id, name, email, balance, transactions, avatar, created_at } = userCreated;

    return {
      _id,
      name,
      email,
      balance,
      transactions,
      avatar,
      created_at,
      token,
    };
  }

  async changePassword(user_id: string, password: string) {
    var codeChecked = await isCodeChecked(user_id);
    if (!codeChecked) throw new Error('Seu codigo já foi ultilizado');

    var user = await User.findOneAndUpdate({ _id: user_id }, { password: password }, { new: true });
    if (!user) throw new Error(userNotFound);

    await setCodeUsed(user_id);

    return `Senha alterada`;
  }

  async signInUser(emailUser: string, password: string) {
    var user = await User.findOne({ email: emailUser }).select('-__v');

    if (!user) throw new Error('Usuário não encotrado');

    if (!user.compareHash(password)) throw new Error('E-mail ou senha incorreta');

    var profilePic = await ProfilePic.findOne({ owner: user._id });
    user.avatar = profilePic;

    const token = user.generateJwt();

    const { _id, name, email, balance, transactions, avatar, created_at } = user;

    return {
      _id,
      name,
      email,
      balance,
      avatar,
      transactions,
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
    if (!response) throw new Error('Não foi possivel fazer o upload');

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
