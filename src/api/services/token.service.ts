import moment from 'moment';
import { Types } from 'mongoose';
import { User, Token } from '@models';
import { sendEmailService } from '@services';
import { failed, success } from '@either/either';
import { generateRandomCode } from '@helpers';
import { ValidationError } from '@either/error';
import constants from '../../constants/user.constants';
import { TParametersDeleteToken } from './interfaces/token';
import { ResponseToken, ResponseTokenChecked } from '@customtypes/token';

const {
  err: { userNotFound, failSendEmail },
} = constants;

export class TokenService {
  async generatePassRecoveryCode(email: string): Promise<ResponseToken> {
    if (!email) return failed(new ValidationError({ message: 'Email invalido', statusCode: 400 }));

    const user = await User.findOne({ email: email });
    if (!user) return failed(new ValidationError({ message: userNotFound, statusCode: 404 }));

    await Token.deleteMany({ user_id: user._id, used: false });

    const code: number = generateRandomCode();
    const expireTimestamp: number = moment().add(5, 'minutes').unix();

    await Token.create({ code, user_id: user._id, expire_timestamp: expireTimestamp });

    const emailSendingStatus = await sendEmailService.execute<Object>(user.email, 'Seu codigo de uso unico', { userName: user.name, code });

    if (!emailSendingStatus) return failed(new ValidationError({ message: failSendEmail, statusCode: 500 }));

    return success(`Acabamos de enviar um codigo para o seu endereço de e-mail registrado ${user.email}`);
  }

  async validateTokenCode(code: number): Promise<ResponseToken> {
    const token = await Token.findOne({ code });
    if (!token) return failed(new ValidationError({ message: 'Codigo invalido', statusCode: 403 }));

    if (token.used) return failed(new ValidationError({ message: 'Codigo já ultilizado', statusCode: 400 }));

    const currentTime: number = moment().unix();
    if (token.expire_timestamp < currentTime) return failed(new ValidationError({ message: 'Codigo expirado', statusCode: 400 }));

    token.checked = true;
    await token.save();
    return success(true);
  }

  async isCodeChecked(user_id: string | Types.ObjectId): Promise<ResponseTokenChecked> {
    const resCode = await Token.findOne({ user_id: user_id });

    if (!resCode) return failed(new ValidationError({ message: 'Codigo não encontrado ou invalido', statusCode: 400 }));

    if (!resCode.checked) return failed(new ValidationError({ message: 'Codigo não foi verificado', statusCode: 400 }));

    if (resCode.used) return failed(new ValidationError({ message: 'Codigo já foi ultilizado', statusCode: 400 }));

    return success({ status: true, data: resCode });
  }

  async setCodeUsed(id: Types.ObjectId | string) {
    await Token.findByIdAndUpdate(id, { used: true });
  }

  async deleteToken({ user_id, code, used, expired }: TParametersDeleteToken) {
    var currentTime: number = moment().unix();

    if (user_id) console.log('🚀 ~ file: token.service.ts:70 ~ TokenService ~ deleteToken ~ user_id', user_id);

    if (code) console.log('🚀 ~ file: token.service.ts:75 ~ TokenService ~ deleteToken ~ code', code);

    if (used) {
      await Token.deleteMany({ used: true });
    }

    if (expired) {
      await Token.deleteMany({ expire_timestamp: { $lte: currentTime } });
    }
  }
}
