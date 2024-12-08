import { HasChildFilterDto } from './has-child.filter.dto';
import { NestedConditionDto } from './nested-condition.dto';
import { MatchPhraseDto } from './match-phrase.dto';
import { QueryStringDto } from './query-string.dto';
import { RangeDto } from './range.dto';
import { HasParentFilterDto } from './has-parent.filter.dto';
import { ElasticSearchConditionsDto } from './elastic-search-conditions.dto';
import { TermsDto } from './terms.dto';
export declare class ElasticSearchExpressionDto {
    has_child?: HasChildFilterDto;
    has_parent?: HasParentFilterDto;
    nested?: NestedConditionDto;
    match_phrase?: MatchPhraseDto;
    query_string?: QueryStringDto;
    range?: RangeDto;
    terms?: TermsDto;
    bool?: ElasticSearchConditionsDto;
}
