import { CronJob } from 'cron';
import TokenService from '../api/services/token.service';

const { deleteToken } = new TokenService();

export const jobOfDeletingTokens = new CronJob('*/5 * * * * ', async () => {
  await deleteToken({ used: true });
});
