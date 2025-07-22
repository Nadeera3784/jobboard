import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SecondFactorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public secondFactorCode: number;
}
