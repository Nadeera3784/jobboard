import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  name: string;
}
