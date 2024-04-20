import * as yargs from 'yargs';
export declare class CommandService {
  private _yargs?;
  private running;
  initialize(metadatas: yargs.CommandModule[]): void;
  exec(): void;
  run(): void;
  exit(code?: number): void;
  get yargs(): yargs.Argv<{}>;
  get isRunning(): boolean;
}
