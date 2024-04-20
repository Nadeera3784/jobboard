"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Argv = exports.Option = exports.Positional = exports.Command = exports.CommandParamTypes = exports.COMMAND_ARGS_METADATA = exports.COMMAND_HANDLER_METADATA = void 0;
const common_1 = require("@nestjs/common");
require("reflect-metadata");
exports.COMMAND_HANDLER_METADATA = '__command-handler-metadata__';
exports.COMMAND_ARGS_METADATA = '__command-args-metadata__';
var CommandParamTypes;
(function (CommandParamTypes) {
    CommandParamTypes["POSITIONAL"] = "POSITIONAL";
    CommandParamTypes["OPTION"] = "OPTION";
    CommandParamTypes["ARGV"] = "ARGV";
})(CommandParamTypes = exports.CommandParamTypes || (exports.CommandParamTypes = {}));
// tslint:disable-next-line typedef
const createCommandParamDecorator = (paramtype) => {
    return (option) => (target, key, index) => {
        const params = Reflect.getMetadata(exports.COMMAND_ARGS_METADATA, target[key]) || {};
        Reflect.defineMetadata(exports.COMMAND_ARGS_METADATA, {
            ...params,
            [paramtype]: [
                ...params[paramtype] || [],
                { index, option },
            ],
        }, target[key]);
    };
};
function Command(option) {
    return (target, key, descriptor) => {
        const metadata = {
            option,
            params: Reflect.getMetadata(exports.COMMAND_ARGS_METADATA, descriptor.value),
        };
        (0, common_1.SetMetadata)(exports.COMMAND_HANDLER_METADATA, metadata)(target, key, descriptor);
    };
}
exports.Command = Command;
exports.Positional = createCommandParamDecorator(CommandParamTypes.POSITIONAL);
exports.Option = createCommandParamDecorator(CommandParamTypes.OPTION);
exports.Argv = createCommandParamDecorator(CommandParamTypes.ARGV);
