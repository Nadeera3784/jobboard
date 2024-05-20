import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class ValidateSecurityQuestionDto {
  public tokenId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  public answer: string;
}
