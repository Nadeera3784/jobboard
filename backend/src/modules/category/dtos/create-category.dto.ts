import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 20, {
    message: 'Name must be between 6 and 20 characters',
  })
  name: string;
}
