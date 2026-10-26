import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Temp 1' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'temp.1@example' })
  @IsString()
  @IsNotEmpty()
  email!: string;
}
