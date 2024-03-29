import { CronOptions } from '../decorators';
export declare type CronOptionsHost = {
    options: CronOptions & Record<'cronTime', string | Date | any>;
};
