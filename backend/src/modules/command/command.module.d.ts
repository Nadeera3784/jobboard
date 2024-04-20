import { OnModuleInit } from '@nestjs/common';
import { CommandExplorerService } from './command-explorer.service';
import { CommandService } from './command.service';
export declare class CommandModule implements OnModuleInit {
  private readonly cliService;
  private readonly commandExplorerService;
  constructor(
    cliService: CommandService,
    commandExplorerService: CommandExplorerService,
  );
  onModuleInit(): void;
}
