import { Request } from 'express';
import { ProfilePic } from '@models';
import { userService } from '@services';
import { failed, success } from '@either/either';
import { validateLoginData } from '@helpers';
import { ValidationError } from '@either/error';
import { ResponseAuth } from '@customtypes/auth';

export class AuthService {
  async login(email: string, password: string): Promise<ResponseAuth> {
    const { isValid, error } = validateLoginData(email, password);
    if (!isValid) return failed(new ValidationError({ message: error.message, statusCode: 400 }));

    const userResult = await userService.findByEmail(email);

    if (userResult.isFailed()) {
      var { message, statusCode } = userResult.value;
      return failed(new ValidationError({ message, statusCode }));
    }

    const user = userResult.value;

    if (!user.compareHash(password)) return failed(new ValidationError({ message: 'E-mail ou senha incorreta', statusCode: 403 }));

    const profilePic = await ProfilePic.findOne({ owner: user?._id });
    const { _id, name, balance, transactions } = user;
    const avatar = profilePic || undefined;
    const token = user.generateJwt();

    return success({
      _id,
      name,
      email,
      balance,
      avatar,
      transactions,
      token,
    });
  }

  async register(data: Request): Promise<ResponseAuth> {
    const user = await userService.create(data.body);
    return user.isSuccess()
      ? success(user.value)
      : failed(new ValidationError({ message: user.value.message, statusCode: user.value.statusCode }));
  }
}
