import crypto from 'crypto';
import seedrandom from 'seedrandom';
import { Token } from '../models/Token';
import { User } from '../models/User';
import constants from '../../constants/user.constants';

const {
  err: { userNotFound },
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

    const generatedToken = Token.create({ code, user_id: user._id });

    return generatedToken;
  }
}

export default TokenService;
