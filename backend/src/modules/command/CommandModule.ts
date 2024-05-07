import { Module, OnModuleInit } from '@nestjs/common';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { CommandExplorerService } from './CommandExplorerService';
import { CommandService } from './CommandService';

@Module({
  providers: [CommandService, CommandExplorerService, MetadataScanner],
})
export class CommandModule implements OnModuleInit {
  constructor(
    private readonly cliService: CommandService,
    private readonly commandExplorerService: CommandExplorerService,
  ) {}
  onModuleInit(): void {
    this.cliService.initialize(this.commandExplorerService.explore());
  }
}
