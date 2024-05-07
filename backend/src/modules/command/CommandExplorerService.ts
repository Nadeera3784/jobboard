import { Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import _ from 'lodash';
import {
  COMMAND_HANDLER_METADATA,
  CommandMetadata,
  CommandParamMetadata,
  CommandParamMetadataItem,
  CommandParamTypes,
} from './CommandDecorator';
import { CommandService } from './CommandService';
import { CommandModule } from 'yargs';

@Injectable()
export class CommandExplorerService {
  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly metadataScanner: MetadataScanner,
    private readonly commandService: CommandService,
  ) {}

  explore(): CommandModule[] {
    const components = [...this.modulesContainer.values()].map(
      (module) => module.components,
    );
    return _.flattenDeep(
      components.map((component) =>
        [...component.values()]
          .filter((x) => x.instance)
          .map(({ instance, metatype }) =>
            this.filterCommands(instance, metatype),
          ),
      ),
    );
  }

  protected filterCommands(instance: any, metatype: any): any {
    const prototype = Object.getPrototypeOf(instance);
    const components = this.metadataScanner.scanFromPrototype(
      instance,
      prototype,
      (name) => this.extractMetadata(instance, prototype, name),
    );
    return components
      .filter((command) => !!command.metadata)
      .map((command) => {
        const exec = instance[command.methodName].bind(instance);
        const builder = (yargs: any) => {
          return this.generateCommandBuilder(command.metadata.params, yargs);
        };
        const handler = async (argv: any) => {
          const params = this.generateCommandHandlerParams(
            command.metadata.params,
            argv,
          );
          this.commandService.run();
          const code = await exec(...params);
          this.commandService.exit(code || 0);
        };
        return {
          ...command.metadata.option,
          builder,
          handler,
        };
      });
  }

  protected extractMetadata(
    instance: any,
    prototype: any,
    methodName: string,
  ): { metadata: CommandMetadata; methodName: string } {
    const callback = prototype[methodName];
    const metadata = Reflect.getMetadata(COMMAND_HANDLER_METADATA, callback);
    return {
      metadata,
      methodName,
    };
  }

  protected iteratorParamMetadata(
    params: CommandParamMetadata<any>,
    callback: (item: CommandParamMetadataItem<any>, key: string) => void,
  ): any {
    _.each(params, (param, key) => {
      _.each(param, (metadata) => callback(metadata, key));
    });
  }

  private generateCommandHandlerParams(
    params: CommandParamMetadata<any>,
    argv: any,
  ): any[] {
    const list: any[] = [];
    this.iteratorParamMetadata(params, (item, key) => {
      switch (key) {
        case CommandParamTypes.OPTION:
          list[item.index] = argv[item.option.name];
          break;
        case CommandParamTypes.POSITIONAL:
          list[item.index] = argv[item.option.name];
          break;
        case CommandParamTypes.ARGV:
          list[item.index] = argv;
        default:
          break;
      }
    });
    return list;
  }

  private generateCommandBuilder(
    params: CommandParamMetadata<any>,
    yargs: any,
  ): any {
    this.iteratorParamMetadata(params, (item, key) => {
      switch (key) {
        case CommandParamTypes.OPTION:
          yargs.option(item.option.name, item.option);
          break;
        case CommandParamTypes.POSITIONAL:
          yargs.positional(item.option.name, item.option);
          break;
        default:
          break;
      }
    });
    return yargs;
  }
}
