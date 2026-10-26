import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserFiltersDto {
  @ApiPropertyOptional({ example: 'Temp 1' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: 'temp.1@example' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email?: string;

  @ApiPropertyOptional({ example: '0d5d5bf4-7c47-49a9-8852-fdb77fa5f8a3' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;
}
