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
exports.DelayRemoveClient = void 0;
const common_1 = require("@nestjs/common");
const elastic_search_client_1 = require("./elastic-search.client");
let DelayRemoveClient = class DelayRemoveClient {
    constructor(client, logger) {
        this.client = client;
        this.logger = logger;
        this.retries = 0;
        this.maxRetries = 10;
        this.timeout = 1000;
    }
    async deleteByQuery(index, type, search) {
        this.retries++;
        const deleted = await this.client.deleteByQuery(index, search);
        if (!deleted && this.retries < this.maxRetries) {
            this.logger.log({
                context: 'DelayRemoveClient',
                index: index,
                message: 'Delaying new cycle.',
                query: search,
                attempt: this.retries,
            });
            setTimeout(() => {
                this.deleteByQuery(index, type, search).catch();
            }, this.timeout);
        }
    }
};
DelayRemoveClient = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [elastic_search_client_1.ElasticSearchClient,
        common_1.Logger])
], DelayRemoveClient);
exports.DelayRemoveClient = DelayRemoveClient;
