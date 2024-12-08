"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticSearchQueryBuilder = void 0;
class ElasticSearchQueryBuilder {
    constructor() {
        this.query = {
            bool: {
                must: [],
                must_not: [],
                should: [],
            },
        };
    }
    getQuery() {
        return this.query;
    }
    getRequest() {
        return {
            from: this.offsetValue || undefined,
            query: this.getQuery(),
            size: this.limit || undefined,
            sort: this.orderBy || undefined,
            stored_fields: this.storedFields || undefined,
        };
    }
    must(condition) {
        if (condition) {
            this.query.bool.must.push(condition);
        }
        return this;
    }
    mustNot(condition) {
        if (condition) {
            this.query.bool.must_not.push(condition);
        }
        return this;
    }
    should(condition) {
        if (condition) {
            this.query.bool.should.push(condition);
        }
        return this;
    }
    shouldNot(condition) {
        if (condition) {
            this.query.bool.should.push({
                bool: {
                    must: [],
                    must_not: [condition],
                    should: [],
                },
            });
        }
        return this;
    }
    addSort(fieldName, direction) {
        if (!this.orderBy) {
            this.orderBy = [];
        }
        this.orderBy.push({
            [fieldName]: { order: direction },
        });
        return this;
    }
    size(size) {
        this.limit = size;
        return this;
    }
    offset(offset) {
        this.offsetValue = offset;
        return this;
    }
    selectFields(fields) {
        this.storedFields = fields;
        return this;
    }
}
exports.ElasticSearchQueryBuilder = ElasticSearchQueryBuilder;
