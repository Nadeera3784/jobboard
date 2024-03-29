import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Form/Select';
import { FilterProps } from '../../types';

export const SingleSelectStaticFilter = ({ data , onFilterChange}: { data: FilterProps; onFilterChange: (value: object) => void; }) => {
    
    const onNativeFilterChange = (selectedValue: string) => {
        const filter = {
            [data.key]: selectedValue
        };
        onFilterChange(filter);
    };

    return (
        <>
            <Select onValueChange={onNativeFilterChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={data.place_holder}/>
                </SelectTrigger>
                <SelectContent>
                {data.data && data.data.map((filter, key) => (
                    <SelectItem key={key} value={filter.value}>{filter.label}</SelectItem>
                ))}
                </SelectContent>
            </Select>
        </>
    );
};