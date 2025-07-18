import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenerateJobDescriptionDto {
  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @IsString()
  @IsOptional()
  additionalInfo?: string;
}
