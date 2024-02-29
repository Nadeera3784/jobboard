import {IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateCategoryDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 20, {
      message: 'Name must be between 6 and 20 characters',
    })
    name: string;
}
