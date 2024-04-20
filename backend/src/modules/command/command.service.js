"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandService = void 0;
const common_1 = require("@nestjs/common");
const yargs = require("yargs");
let CommandService = class CommandService {
    constructor() {
        this.running = false;
    }
    initialize(metadatas) {
        this.yargs.scriptName('cli');
        this.yargs.strict();
        for (const command of metadatas) {
            this.yargs.command(command);
        }
    }
    exec() {
        this.yargs.demandCommand(1);
        this.yargs.help('h')
            .alias('h', 'help')
            .alias('v', 'version');
        //  Do not remove it.
        //  yargs process commands in property getter
        this.yargs.argv;
    }
    run() {
        this.running = true;
    }
    exit(code) {
        this.running = false;
        process.exit(code);
    }
    get yargs() {
        if (this._yargs === undefined) {
            this._yargs = yargs;
        }
        return this._yargs;
    }
    get isRunning() {
        return this.running;
    }
};
CommandService = __decorate([
    (0, common_1.Injectable)()
], CommandService);
exports.CommandService = CommandService;
