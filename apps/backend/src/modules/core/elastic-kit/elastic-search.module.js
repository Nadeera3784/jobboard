"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ElasticSearchModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticSearchModule = void 0;
const common_1 = require("@nestjs/common");
const delay_remove_client_1 = require("./delay-remove.client");
const elastic_search_client_1 = require("./elastic-search.client");
const elastic_search_config_1 = require("./elastic-search.config");
let ElasticSearchModule = ElasticSearchModule_1 = class ElasticSearchModule {
    static forRoot(config) {
        return {
            exports: [],
            module: ElasticSearchModule_1,
            providers: [
                {
                    provide: elastic_search_config_1.ElasticSearchConfig,
                    useValue: config,
                },
            ],
        };
    }
};
ElasticSearchModule = ElasticSearchModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        exports: [
            delay_remove_client_1.DelayRemoveClient,
            elastic_search_client_1.ElasticSearchClient,
        ],
        providers: [
            delay_remove_client_1.DelayRemoveClient,
            elastic_search_client_1.ElasticSearchClient,
        ],
    })
], ElasticSearchModule);
exports.ElasticSearchModule = ElasticSearchModule;
