import Joi from 'joi';
import { Types } from 'mongoose';
import { tokenService } from './index';
import { User, IUser, ProfilePic, IProfilePic } from '../models';

import { isIdValid } from '../../utils/isIdValid';
import constantsUser from '../../constants/user.constants';
import { uploadFileGoogleDrive, deleteFileGoogleDrive } from '../../utils/googleDriveApi';
import { Either, left, right } from '../../errors/either';
import { ValidationError } from '../../errors/error';

const {
  err: { invalidUser, invalidGoogleFileId, userNotFound },
} = constantsUser;

interface ResponseUserProps {
  _id: Types.ObjectId;
  name: string;
  email: string;
  balance: number;
  transactions: string;
  avatar: object;
  created_at: Date;
  token: string;
}

type ResponseUser = Either<ValidationError, ResponseUserProps>;
type ResponseChangeUserPassword = Either<ValidationError, string>;
type ResponseUploadProfilePic = Either<ValidationError, IProfilePic>;

export class UserService {
  async findOneUserByID(user_id: string) {
    var response: IUser = await User.findOne({ _id: user_id }).select('-password -__v');
    if (!response) return null;

    var avatar = await ProfilePic.findOne({ owner: user_id });
    response.avatar = avatar;

    response.transactions = `http://localhost:8080/api/v1/transaction/${response._id}`;

    return response;
  }

  async createUser(user: IUser): Promise<ResponseUser> {
    const schemaValidation = Joi.object({
      email: Joi.string().required().email().error(new Error('O email é obrigatório')),
      name: Joi.string().min(1).required().error(new Error('O nome é obrigatório')),
      password: Joi.string()
        .min(6)
        .required()
        .error(new Error('A senha é obrigatória e deve conter pelo menos 6 digitos')),
    });

    const { error, value } = await schemaValidation.validate(user);
    if (error) return left(new ValidationError({ message: error.message, statusCode: 400 }));

    const findUser = await User.findOne({ email: user.email });
    if (findUser)
      return left(new ValidationError({ message: 'Usuário já cadastrado', statusCode: 409 }));

    var userCreated = await User.create(user);
    var token = userCreated.generateJwt();

    const { _id, name, email, balance, transactions, avatar, created_at } = userCreated;

    return right({
      _id,
      name,
      email,
      balance,
      transactions,
      avatar,
      created_at,
      token,
    });
  }

  async changePassword(email: string, password: string): Promise<ResponseChangeUserPassword> {
    var user = await User.findOne({ email });
    if (!user) return left(new ValidationError({ message: userNotFound, statusCode: 404 }));

    var codeChecked = await tokenService.isCodeChecked(user._id);

    if (codeChecked.isLeft())
      return left(new ValidationError({ message: codeChecked.value.message, statusCode: 400 }));

    var user = await User.findOneAndUpdate(
      { _id: user._id },
      { password: password },
      { new: true }
    );

    await tokenService.setCodeUsed(codeChecked.value.data._id);

    return right('Senha alterada com sucesso!');
  }

  async signInUser(emailUser: string, password: string): Promise<ResponseUser> {
    var user = await User.findOne({ email: emailUser }).select('-__v');

    if (!user) return left(new ValidationError({ message: userNotFound, statusCode: 404 }));

    if (!user.compareHash(password))
      return left(new ValidationError({ message: 'E-mail ou senha incorreta', statusCode: 403 }));

    var profilePic = await ProfilePic.findOne({ owner: user._id });
    user.avatar = profilePic;

    const token = user.generateJwt();

    const { _id, name, email, balance, transactions, avatar, created_at } = user;

    return right({
      _id,
      name,
      email,
      balance,
      avatar,
      transactions,
      created_at,
      token,
    });
  }

  async uploadProfilePic(owner: string, avatar: any): Promise<ResponseUploadProfilePic> {
    if (!isIdValid(owner))
      return left(new ValidationError({ message: invalidUser, statusCode: 400 }));
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
    if (!response)
      return left(
        new ValidationError({ message: 'Não foi possivel fazer o upload', statusCode: 500 })
      );

    avatarFilter.url = `https://drive.google.com/uc?export=view&id=${response.id}`;
    avatarFilter.googleFileId = response.id;

    const avatarCreated = await ProfilePic.create(avatarFilter);

    return right({
      url: avatarCreated.url,
      size: avatarCreated.size,
      owner: avatarCreated.owner,
      mimetype: avatarCreated.mimetype,
      filename: avatarCreated.filename,
      googleFileId: avatarCreated.googleFileId,
    });
  }

  async deleteProfilePic(fileId: string) {
    if (!fileId) throw new Error(invalidGoogleFileId);

    const response = await deleteFileGoogleDrive(fileId);
    return response;
  }
}
