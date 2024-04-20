import { Injectable as InjectableInterface } from '@nestjs/common/interfaces';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { CommandModule } from 'yargs';
import {
  CommandParamMetadata,
  CommandParamMetadataItem,
} from './command.decorator';
import { CommandService } from './command.service';
export declare class CommandExplorerService {
  private readonly modulesContainer;
  private readonly metadataScanner;
  private readonly commandService;
  constructor(
    modulesContainer: ModulesContainer,
    metadataScanner: MetadataScanner,
    commandService: CommandService,
  );
  explore(): CommandModule[];
  protected filterCommands(instance: InjectableInterface, metatype: any): any;
  protected extractMetadata(
    instance: any,
    prototype: any,
    methodName: string,
  ): object;
  protected iteratorParamMetadata<O>(
    params: CommandParamMetadata<O>,
    callback: (item: CommandParamMetadataItem<O>, key: string) => void,
  ): any;
  private generateCommandHandlerParams;
  private generateCommandBuilder;
}
