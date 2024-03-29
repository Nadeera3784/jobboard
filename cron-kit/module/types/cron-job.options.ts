import { CronJob } from 'cron';
import { CronOptionsHost } from './cron-options.host';
import { RefHost } from './ref.host';
import { TargetHost } from './target.host';
export declare type CronJobOptions = TargetHost & CronOptionsHost & RefHost<CronJob>;
