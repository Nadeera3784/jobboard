import { DiscoveryService } from '../../discovery';
import { CronJobOptions } from './types/cron-job.options';
export declare class CronExplorer {
    private readonly discoveryService;
    constructor(discoveryService: DiscoveryService);
    collectHandlers(): Promise<Map<string, CronJobOptions>>;
}
