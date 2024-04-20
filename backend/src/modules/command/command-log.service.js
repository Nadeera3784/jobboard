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
exports.CommandLogService = void 0;
const common_1 = require("@nestjs/common");
const command_service_1 = require("./command.service");
let CommandLogService = class CommandLogService {
    constructor(commandService) {
        this.commandService = commandService;
    }
    log(message) {
        if (!this.isRunning) {
            return;
        }
        // eslint-disable-next-line no-console
        console.log(message);
    }
    error(message, trace) {
        if (!this.isRunning) {
            return;
        }
        // eslint-disable-next-line no-console
        console.error(message, trace);
    }
    warn(message) {
        if (!this.isRunning) {
            return;
        }
        // eslint-disable-next-line no-console
        console.warn(message);
    }
    get isRunning() {
        return this.commandService.isRunning;
    }
};
CommandLogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [command_service_1.CommandService])
], CommandLogService);
exports.CommandLogService = CommandLogService;
