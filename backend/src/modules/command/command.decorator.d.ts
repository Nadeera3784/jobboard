import 'reflect-metadata';
import { Options, PositionalOptions } from 'yargs';
export declare const COMMAND_HANDLER_METADATA: string;
export declare const COMMAND_ARGS_METADATA: string;
export declare enum CommandParamTypes {
  POSITIONAL = 'POSITIONAL',
  OPTION = 'OPTION',
  ARGV = 'ARGV',
}
export declare type CommandParamMetadata<O> = {
  [type in CommandParamTypes]: Array<CommandParamMetadataItem<O>>;
};
export interface CommandParamMetadataItem<O> {
  index: number;
  option: O;
}
export interface CommandMetadata {
  params: CommandParamMetadata<CommandPositionalOption | CommandOptionsOption>;
  option: CommandOption;
}
export interface CommandOption {
  aliases?: string[] | string;
  command: string[] | string;
  describe?: string | false;
}
export declare function Command(option: CommandOption): MethodDecorator;
export interface CommandPositionalOption extends PositionalOptions {
  name: string;
}
export declare const Positional: (
  option?: CommandPositionalOption,
) => ParameterDecorator;
export interface CommandOptionsOption extends Options {
  name: string;
}
export declare const Option: (
  option?: CommandPositionalOption,
) => ParameterDecorator;
export declare const Argv: (
  option?: CommandPositionalOption,
) => ParameterDecorator;
