import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { SecurityQuestionEnum } from '../enums';

@Exclude()
export class SecurityQuestionDto {
  public userId: string;

  @ApiProperty()
  @IsNotEmpty()
  @Expose()
  @IsEnum(SecurityQuestionEnum)
  public question: SecurityQuestionEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  public answer: string;
}
