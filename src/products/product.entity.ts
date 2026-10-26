import { ApiProperty } from '@nestjs/swagger';

export class ProductEntity {
  @ApiProperty({ example: 'afb43c3e-0716-4c86-80d1-a41c52db0ad4' })
  id!: string;

  @ApiProperty({ example: 'Notebook' })
  name!: string;

  @ApiProperty({ example: 12.5 })
  price!: number;

  @ApiProperty({ example: 25 })
  stock!: number;

  @ApiProperty({ example: '2026-01-15T09:30:00.000Z' })
  created_at!: string;
}
