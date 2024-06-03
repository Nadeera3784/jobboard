import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateLocationDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  name: string;

  @IsString()
  @IsOptional()
  status: string;
}
