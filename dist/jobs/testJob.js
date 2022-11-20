"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.job = void 0;
const cron_1 = require("cron");
exports.job = new cron_1.CronJob('* */10 * * * ', () => {
    console.info('job send 5s');
});
//# sourceMappingURL=testJob.js.map