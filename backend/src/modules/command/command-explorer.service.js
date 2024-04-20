"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandExplorerService = void 0;
const common_1 = require("@nestjs/common");
const modules_container_1 = require("@nestjs/core/injector/modules-container");
const metadata_scanner_1 = require("@nestjs/core/metadata-scanner");
const _ = require("lodash");
const command_decorator_1 = require("./command.decorator");
const command_service_1 = require("./command.service");
let CommandExplorerService = class CommandExplorerService {
    constructor(modulesContainer, metadataScanner, commandService) {
        this.modulesContainer = modulesContainer;
        this.metadataScanner = metadataScanner;
        this.commandService = commandService;
    }
    explore() {
        const components = [...this.modulesContainer.values()].map((module) => module.components);
        return _.flattenDeep(components.map((component) => [...component.values()]
            .filter((x) => x.instance)
            .map(({ instance, metatype }) => this.filterCommands(instance, metatype))));
    }
    filterCommands(instance, metatype) {
        const prototype = Object.getPrototypeOf(instance);
        // tslint:disable-next-line typedef
        const components = this.metadataScanner.scanFromPrototype(instance, prototype, (name) => this.extractMetadata(instance, prototype, name));
        return components
            .filter((command) => !!command.metadata)
            .map((command) => {
            const exec = instance[command.methodName].bind(instance);
            const builder = (yargs) => {
                return this.generateCommandBuilder(command.metadata.params, yargs);
            }; // EOF builder
            const handler = async (argv) => {
                const params = this.generateCommandHandlerParams(command.metadata.params, argv);
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
    extractMetadata(instance, prototype, methodName) {
        const callback = prototype[methodName];
        const metadata = Reflect.getMetadata(command_decorator_1.COMMAND_HANDLER_METADATA, callback);
        return {
            metadata,
            methodName,
        };
    }
    iteratorParamMetadata(params, callback) {
        _.each(params, (param, key) => {
            _.each(param, (metadata) => callback(metadata, key));
        });
    }
    generateCommandHandlerParams(params, argv) {
        const list = [];
        this.iteratorParamMetadata(params, (item, key) => {
            switch (key) {
                case command_decorator_1.CommandParamTypes.OPTION:
                    list[item.index] = argv[item.option.name];
                    break;
                case command_decorator_1.CommandParamTypes.POSITIONAL:
                    list[item.index] =
                        argv[item.option.name];
                    break;
                case command_decorator_1.CommandParamTypes.ARGV:
                    list[item.index] = argv;
                default:
                    break;
            }
        });
        return list;
    }
    generateCommandBuilder(params, yargs) {
        this.iteratorParamMetadata(params, (item, key) => {
            switch (key) {
                case command_decorator_1.CommandParamTypes.OPTION:
                    yargs.option(item.option.name, item.option);
                    break;
                case command_decorator_1.CommandParamTypes.POSITIONAL:
                    yargs.positional(item.option.name, item.option);
                    break;
                default:
                    break;
            }
        });
        return yargs;
    }
};
CommandExplorerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [modules_container_1.ModulesContainer,
        metadata_scanner_1.MetadataScanner,
        command_service_1.CommandService])
], CommandExplorerService);
exports.CommandExplorerService = CommandExplorerService;
