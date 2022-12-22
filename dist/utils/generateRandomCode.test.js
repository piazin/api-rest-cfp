"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateRandomCode_1 = require("./generateRandomCode");
test('the random code must contain 6 digits', () => {
    var code = (0, generateRandomCode_1.generateRandomCode)();
    expect(code.toString()).toHaveLength(6);
});
//# sourceMappingURL=generateRandomCode.test.js.map