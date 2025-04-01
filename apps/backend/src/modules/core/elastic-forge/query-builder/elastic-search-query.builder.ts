import { ElasticSearchExpressionDto, ElasticSearchQueryDto } from '../dto';

export class ElasticSearchQueryBuilder {
    private query: ElasticSearchQueryDto;
    private storedFields?: string[];
    private orderBy?: Array<{[key: string]: {order: string}}>;
    private limit?: number;
    private offsetValue?: number;

    constructor() {
        this.query = {
            bool: {
                must: [],
                must_not: [],
                should: [],
            },
        };
    }

    getQuery(): ElasticSearchQueryDto {
        return this.query;
    }

    getRequest(): any {
        return {
            from: this.offsetValue || undefined,
            query: this.getQuery(),
            size: this.limit || undefined,
            sort: this.orderBy || undefined,
            stored_fields: this.storedFields || undefined,
        };
    }

    must(condition: ElasticSearchExpressionDto): ElasticSearchQueryBuilder {
        if (condition) {
            this.query.bool!.must.push(condition);
        }
        return this;
    }

    mustNot(condition: ElasticSearchExpressionDto): ElasticSearchQueryBuilder {
        if (condition) {
            this.query.bool!.must_not.push(condition);
        }
        return this;
    }

    should(condition: ElasticSearchExpressionDto): ElasticSearchQueryBuilder {
        if (condition) {
            this.query.bool!.should.push(condition);
        }
        return this;
    }

    shouldNot(condition: ElasticSearchExpressionDto): ElasticSearchQueryBuilder {
        if (condition) {
            this.query.bool!.should.push({
                bool: {
                    must: [],
                    must_not: [condition],
                    should: [],
                },
            });
        }
        return this;
    }

    addSort(fieldName: string, direction: string): ElasticSearchQueryBuilder {
        if (!this.orderBy) {
            this.orderBy = [];
        }
        this.orderBy.push({
            [fieldName]: { order: direction },
        });
        return this;
    }

    size(size: number): ElasticSearchQueryBuilder {
        this.limit = size;
        return this;
    }

    offset(offset: number): ElasticSearchQueryBuilder {
        this.offsetValue = offset;
        return this;
    }

    selectFields(fields: string[]): ElasticSearchQueryBuilder {
        this.storedFields = fields;
        return this;
    }
}