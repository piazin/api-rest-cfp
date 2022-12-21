import { generateRandomCode } from './generateRandomCode';

test('the random code must contain 6 digits', () => {
  var code = generateRandomCode();
  expect(code.toString()).toHaveLength(6);
});
