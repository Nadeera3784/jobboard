import { StringFieldConditionEnum, FilterFieldTypeEnum } from '../enums';
import { CommonFilterInterface } from '../interfaces';

export class ExpandFilterHelper {
    static expandChildFilter(filter: CommonFilterInterface): CommonFilterInterface {
        const splitFieldName = filter.field.split('.');
        const parentFieldName = splitFieldName.shift();
        const parentFieldType = this.getFieldType(parentFieldName);
        
        let newFilter;
        if (parentFieldName && parentFieldType) {
            filter.field = splitFieldName.join('.');
            newFilter = {
                field: parentFieldName,
                fieldCondition: StringFieldConditionEnum.Is,
                fieldType: parentFieldType,
                filters: [filter],
                value: null,
            };
        }
        
        return newFilter || filter;
    }

    private static getFieldType(fieldName: string): FilterFieldTypeEnum | undefined {
        if (fieldName === 'variants') {
            return FilterFieldTypeEnum.Child;
        }
    }
}