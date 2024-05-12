import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsOptional()
  status?: string;
}
