import {IsString, IsNotEmpty, IsMongoId} from 'class-validator';

export class IdDto{
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    id: string;
}