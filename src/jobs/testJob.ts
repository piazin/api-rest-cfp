import { CronJob } from 'cron';

export const job = new CronJob('* */10 * * * ', () => {
  console.info('job send 5s');
});
