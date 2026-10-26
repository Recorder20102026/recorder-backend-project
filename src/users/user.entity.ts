import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({ example: '0d5d5bf4-7c47-49a9-8852-fdb77fa5f8a3' })
  id!: string;

  @ApiProperty({ example: 'jane_doe' })
  username!: string;

  @ApiProperty({ example: 'jane@example.com' })
  email!: string;

  @ApiProperty({ example: '2026-01-15T09:30:00.000Z' })
  created_at!: string;
}
