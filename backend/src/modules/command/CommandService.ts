import { Injectable } from '@nestjs/common';
import * as yargs from 'yargs';

@Injectable()
export class CommandService {
  private _yargs?: yargs.Argv<{}>;
  private running: boolean = false;

  initialize(metadatas: yargs.CommandModule[]): void {
    this.yargs.scriptName('cli');
    this.yargs.strict();
    for (const command of metadatas) {
      this.yargs.command(command);
    }
  }

  exec(): void {
    this.yargs.demandCommand(1);
    this.yargs.help('h').alias('h', 'help').alias('v', 'version');
    //  Do not remove it.
    //  yargs process commands in property getter
    this.yargs.argv;
  }

  run(): void {
    this.running = true;
  }

  exit(code?: number): void {
    this.running = false;
    process.exit(code);
  }

  get yargs(): yargs.Argv<{}> {
    if (this._yargs === undefined) {
      this._yargs = yargs;
    }
    return this._yargs;
  }

  get isRunning(): boolean {
    return this.running;
  }
}
