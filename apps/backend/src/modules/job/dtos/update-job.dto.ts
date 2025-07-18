import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateJobDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  user?: string;

  @IsString()
  @IsNotEmpty()
  remote: string;

  @IsString()
  @IsNotEmpty()
  job_type: string;

  @IsString()
  @IsNotEmpty()
  experience_level: string;
}
