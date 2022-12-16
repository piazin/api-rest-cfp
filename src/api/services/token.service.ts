import crypto from 'crypto';
import moment from 'moment';
import { Types } from 'mongoose';
import seedrandom from 'seedrandom';
import { Token } from '../models/Token';
import { User } from '../models/User';
import constants from '../../constants/user.constants';
import sendEmail from '../../utils/sendEmail';

const {
  err: { userNotFound, failSendEmail },
} = constants;

type TParametersDeleteToken = {
  user_id?: string;
  code?: number;
  used?: boolean;
  expired?: boolean;
};

class TokenService {
  async generatePassRecoveryCode(email: string, ip: string | string[]) {
    if (!email) throw new Error('Email invalido');

    const user = await User.findOne({ email: email });
    if (!user) throw new Error(userNotFound);

    await Token.deleteMany({ user_id: user._id, used: false });

    var code: number;
    var codeString: string;
    var expire_timestamp: number = moment().add(5, 'minutes').unix();
    var randomBytes = crypto.randomBytes(64).toString('base64');
    var generateCode = seedrandom(randomBytes, { entropy: true });
    codeString = generateCode().toString().replace('0', '');
    code = parseInt(codeString.substring(3, 9));

    await Token.create({ code, user_id: user._id, expire_timestamp });

    var emailSendingStatus = await sendEmail(user.email, user.name, code);
    if (!emailSendingStatus) throw new Error(failSendEmail);

    return `Enviamos um email para ${user.email}`;
  }

  async validateTokenCode(code: number) {
    if (!code) throw new Error('Codigo invalido');

    var resCode = await Token.findOne({ code });
    if (!resCode) throw new Error('Codigo invalido');
    if (resCode.used) throw new Error('Codigo já ultilizado');

    var currentTime: number = moment().unix();
    if (resCode.expire_timestamp < currentTime) throw new Error('Codigo expirado');

    await resCode.updateOne({ checked: true });
    return true;
  }

  async isCodeChecked(user_id: string | Types.ObjectId) {
    var resCode = await Token.findOne({ user_id: user_id, used: false, checked: true });

    if (!resCode) throw new Error('Codigo não encontrado ou invalido');
    if (!resCode.checked) throw new Error('Codigo não foi verificado');
    if (resCode.used) throw new Error('Codigo já foi ultilizado');

    return { status: true, data: resCode };
  }

  async setCodeUsed(id: Types.ObjectId | string) {
    await Token.findByIdAndUpdate(id, { used: true });
  }

  async deleteToken({ user_id, code, used, expired }: TParametersDeleteToken) {
    var currentTime: number = moment().unix();

    if (user_id)
      console.log('🚀 ~ file: token.service.ts:70 ~ TokenService ~ deleteToken ~ user_id', user_id);

    if (code)
      console.log('🚀 ~ file: token.service.ts:75 ~ TokenService ~ deleteToken ~ code', code);

    if (used) {
      await Token.deleteMany({ used: true });
    }

    if (expired) {
      await Token.deleteMany({ expire_timestamp: { $lte: currentTime } });
    }
  }
}

export default TokenService;
