import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../database/database.service';
import { UserEntity } from './user.entity';

interface UserRow extends QueryResultRow {
  id: string;
  username: string;
  email: string;
  created_at: Date;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly database: DatabaseService) {}

  async findAll(): Promise<UserEntity[]> {
    try {
      const { rows } = await this.database.query<UserRow>(
        'SELECT id, username, email, created_at FROM public.users',
      );
      return rows.map((row) => ({
        ...row,
        created_at: row.created_at.toISOString(),
      }));
    } catch (error) {
      this.logger.error(
        'PostgreSQL users query failed',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Unable to retrieve users');
    }
  }
}
