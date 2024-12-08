export interface ElasticFilterQueryItem {
    range?: {
        [key: string]: {
            gte?: string;
            lt?: string;
            gt?: string;
        };
    };
    query_string?: {
        fields: string[];
        query: string;
    };
    match?: {
        [key: string]: any;
    };
    match_phrase?: {
        [key: string]: any;
    };
    bool?: ElasticQuery;
    term?: {
        [key: string]: any;
    };
    wildcard?: {
        [key: string]: {
            value: string;
            boost?: number;
        };
    };
}
export interface ElasticQuery {
    must?: ElasticFilterQueryItem[];
    must_not?: ElasticFilterQueryItem[];
    should?: ElasticFilterQueryItem[];
}
export interface ESSearchBody {
    query: ElasticQuery | ElasticFilterQueryItem;
    size?: number;
    from?: number;
    sort?: Array<{
        [key: string]: string;
    }>;
    aggs?: {
        [key: string]: {
            terms: {
                field: string;
            };
        };
    };
}
