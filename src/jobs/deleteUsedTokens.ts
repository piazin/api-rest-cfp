import { CronJob } from 'cron';
import { tokenService } from '../api/services/index';

export const jobOfDeletingTokens = new CronJob('*/5 * * * * ', async () => {
  await tokenService.deleteToken({ used: true, expired: true });
});
