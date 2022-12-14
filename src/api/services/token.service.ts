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

class TokenService {
  async generatePassRecoveryCode(email: string, ip: string | string[]) {
    if (!email) throw new Error('Email invalido');

    const user = await User.findOne({ email: email });
    if (!user) throw new Error(userNotFound);

    var code: number;
    var randomBytes = crypto.randomBytes(64).toString('base64');
    var generateCode = seedrandom(randomBytes, { entropy: true });
    code = parseInt(generateCode().toString().substring(3, 9));

    await Token.create({ code, user_id: user._id });

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

  async isCodeChecked(user_id: string) {
    var resCode = await Token.findOne({ user_id: user_id, used: false });

    if (!resCode) throw new Error('Codigo não encontrado ou invalido');
    if (!resCode.checked) throw new Error('Codigo não foi verificado');
    if (resCode.used) throw new Error('Codigo já foi ultilizado');

    return true;
  }

  async setCodeUsed(user_id: Types.ObjectId | string) {
    await Token.findOneAndUpdate({ user_id: user_id }, { $set: { used: true } });
  }
}

export default TokenService;
