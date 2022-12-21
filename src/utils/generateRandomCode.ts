import { randomBytes } from 'crypto';
import seedrandom from 'seedrandom';

export const generateRandomCode = (): number => {
  var code: number;

  var randomBytesGenerated: string = randomBytes(64).toString('base64');
  var generatedCode = seedrandom(randomBytesGenerated, { entropy: true })();
  code = parseInt(generatedCode.toString().replace(/[0.]/g, '').substring(3, 9));

  return code;
};
