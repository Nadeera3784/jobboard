import { IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';

export class UpdateLocationDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 20, {
    message: 'Name must be between 6 and 20 characters',
  })
  name: string;

  @IsString()
  @IsOptional()
  status: string;
}
