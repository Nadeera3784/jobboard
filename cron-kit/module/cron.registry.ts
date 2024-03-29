import { CronJob } from 'cron';
export  class CronRegistry {
    private readonly cronJobs;
    getJob(name: string): CronJob;
    getJobs(): Map<string, CronJob>;
    addJob(name: string, job: CronJob): void;
    removeJob(name: string): void;
    clear(): void;
}
