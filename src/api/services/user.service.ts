import Joi from 'joi';
import { categoryService, tokenService } from '@services';
import { User, IUser, ProfilePic, IProfilePic } from '@models';

import { isIdValid } from '@utils';
import { UpdateUserDto } from '@dto';
import { failed, success } from '@either/either';
import { ValidationError } from '@either/error';
import constantsUser from '../../constants/user.constants';
import { uploadFileGoogleDrive, deleteFileGoogleDrive } from '../../apis/googleDriveApi';
import { ResponseChangeUserPassword, ResponseUploadProfilePic, ResponseUser, ResponseUserFind } from '@customtypes/user';

const {
  err: { invalidUser, invalidGoogleFileId, userNotFound },
} = constantsUser;

export class UserService {
  async findById(user_id: string): Promise<ResponseUserFind> {
    if (!isIdValid(user_id)) return failed(new ValidationError({ message: 'Usuário não encontrado ou ID invalido', statusCode: 400 }));

    var user = await User.findOne({ _id: user_id }).select('-password -__v');
    if (!user) return failed(new ValidationError({ message: userNotFound, statusCode: 404 }));

    var avatar = await ProfilePic.findOne({ owner: user_id });
    user.avatar = avatar;

    return success(user);
  }

  async findByEmail(email: string): Promise<ResponseUserFind> {
    var user = await User.findOne({ email }).select('-password, -__v');
    if (!user) return failed(new ValidationError({ message: userNotFound, statusCode: 404 }));

    var avatar = await ProfilePic.findOne({ owner: user._id });
    user.avatar = avatar;

    return success(user);
  }

  async create(user: IUser): Promise<ResponseUser> {
    const schemaValidation = Joi.object({
      email: Joi.string().required().email().error(new Error('O email é obrigatório')),
      name: Joi.string().min(1).required().error(new Error('O nome é obrigatório')),
      password: Joi.string().min(6).required().error(new Error('A senha é obrigatória e deve conter pelo menos 6 digitos')),
    });

    const { error, value } = schemaValidation.validate(user);
    if (error) return failed(new ValidationError({ message: error.message, statusCode: 400 }));

    const userAlreadyExists = await User.findOne({ email: user.email });
    if (userAlreadyExists) return failed(new ValidationError({ message: 'Usuário já cadastrado', statusCode: 409 }));

    var userCreated = await User.create(user);

    await categoryService.addDefaultCategoriesToUser(userCreated._id);
    userCreated.transactions = `https://localhost:8080/api/v1/transaction/${userCreated._id}`;
    await userCreated.save();

    var token = userCreated.generateJwt();

    const { _id, name, email, balance, transactions, avatar, created_at } = userCreated;

    return success({
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

  async update(updateUserDto: UpdateUserDto, id: string): Promise<ResponseUserFind> {
    const schemaValidation = Joi.object({
      email: Joi.string().email().error(new Error('O não é valido!')),
      name: Joi.string().min(1).error(new Error('O nome não é valido!')),
      password: Joi.string().min(6).error(new Error('A senha é não é valida! Deve conter pelo menos 6 digitos')),
      currentPassword: Joi.string().error(new Error('A senha é não é valida!')),
    });

    const { error, value } = schemaValidation.validate(updateUserDto);
    if (error) return failed(new ValidationError({ message: error.message, statusCode: 400 }));
    if (!isIdValid(id)) return failed(new ValidationError({ message: 'Usuário não encontrado ou ID invalido', statusCode: 404 }));
    if (Object.keys(updateUserDto).length === 0)
      return failed(new ValidationError({ message: 'Nenhuma informação á ser atualizada', statusCode: 400 }));

    const user = await User.findById(id);
    if (!user) return failed(new ValidationError({ message: 'Usuário não encontrado', statusCode: 404 }));

    if (updateUserDto?.email) {
      const userWithThisEmail = await User.findOne({ email: updateUserDto.email });

      if (userWithThisEmail) {
        if (user.email !== userWithThisEmail.email) {
          return failed(new ValidationError({ message: 'O email já está sendo usado', statusCode: 400 }));
        }
      }
    }

    if (updateUserDto?.password) {
      if (!updateUserDto?.currentPassword) return failed(new ValidationError({ message: 'A senha atual não é valida', statusCode: 401 }));

      if (!user.compareHash(updateUserDto.currentPassword))
        return failed(new ValidationError({ message: 'Senha incorreta!', statusCode: 401 }));
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateUserDto, { new: true }).select('-password -__v');

    return success(updatedUser);
  }

  async changePassword(email: string, password: string): Promise<ResponseChangeUserPassword> {
    var user = await User.findOne({ email });
    if (!user) return failed(new ValidationError({ message: userNotFound, statusCode: 404 }));

    var codeChecked = await tokenService.isCodeChecked(user._id);

    if (codeChecked.isFailed()) return failed(new ValidationError({ message: codeChecked.value.message, statusCode: 400 }));

    var user = await User.findOneAndUpdate({ _id: user._id }, { password: password }, { new: true });

    await tokenService.setCodeUsed(codeChecked.value.data._id);

    return success('Senha alterada com sucesso!');
  }

  async uploadProfilePic(owner: string, avatar: any): Promise<ResponseUploadProfilePic> {
    if (!isIdValid(owner)) return failed(new ValidationError({ message: invalidUser, statusCode: 400 }));
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
    if (!response) return failed(new ValidationError({ message: 'Não foi possivel fazer o upload', statusCode: 500 }));

    avatarFilter.url = `https://drive.google.com/uc?export=view&id=${response.id}`;
    avatarFilter.googleFileId = response.id;

    const avatarCreated = await ProfilePic.create(avatarFilter);

    return success({
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
