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
exports.CommandModule = void 0;
const common_1 = require("@nestjs/common");
const metadata_scanner_1 = require("@nestjs/core/metadata-scanner");
const command_explorer_service_1 = require("./command-explorer.service");
const command_service_1 = require("./command.service");
let CommandModule = class CommandModule {
    constructor(cliService, commandExplorerService) {
        this.cliService = cliService;
        this.commandExplorerService = commandExplorerService;
    }
    onModuleInit() {
        this.cliService.initialize(this.commandExplorerService.explore());
    }
};
CommandModule = __decorate([
    (0, common_1.Module)({
        providers: [
            command_service_1.CommandService,
            command_explorer_service_1.CommandExplorerService,
            metadata_scanner_1.MetadataScanner,
        ],
    }),
    __metadata("design:paramtypes", [command_service_1.CommandService,
        command_explorer_service_1.CommandExplorerService])
], CommandModule);
exports.CommandModule = CommandModule;
