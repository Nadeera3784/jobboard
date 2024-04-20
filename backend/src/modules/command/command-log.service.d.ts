import { CommandService } from './command.service';
export declare class CommandLogService {
  private readonly commandService;
  constructor(commandService: CommandService);
  log(message: string): void;
  error(message: string, trace: string): void;
  warn(message: string): void;
  private get isRunning();
}
