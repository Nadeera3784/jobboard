import { AnalyzerEnum, SearchAnalyzer } from '../enums';

export interface ElasticFieldConfigInterface {
    type: string;
    properties?: {
        [field: string]: ElasticFieldConfigInterface;
    };
    fielddata?: boolean;
    fields?: any;
    analyzer?: AnalyzerEnum;
    search_analyzer?: SearchAnalyzer;
}