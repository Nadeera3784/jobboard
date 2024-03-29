import { Server } from '@nestjs/microservices';
import { CronExplorer } from './cron.explorer';
import { CronRegistry } from './cron.registry';
export declare class CronServer extends Server {
    private readonly cronExplorer;
    private readonly cronRegistry;
    constructor(cronExplorer: CronExplorer, cronRegistry: CronRegistry);
    listen(callback: () => void): Promise<void>;
    close(): Promise<void>;
    private startJobs;
    private closeJobs;
}
