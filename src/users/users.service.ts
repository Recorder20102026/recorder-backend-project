import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UserEntity } from './user.entity';

interface UserRow extends QueryResultRow {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly database: DatabaseService) {}

  async findAll(filters: UserFiltersDto = {}): Promise<UserEntity[]> {
    try {
      const conditions: string[] = [];
      const values: string[] = [];

      for (const [field, column] of [
        ['name', 'username'],
        ['email', 'email'],
        ['id', 'id'],
      ] as const) {
        const value = filters[field];
        if (value !== undefined) {
          values.push(value);
          conditions.push(`${column} = $${values.length}`);
        }
      }

      const whereClause =
        conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
      const { rows } = await this.database.query<UserRow>(
        `SELECT id, username AS name, email, created_at FROM public.users${whereClause}`,
        values,
      );
      return rows.map((row) => this.toUserEntity(row));
    } catch (error) {
      this.throwDatabaseError('PostgreSQL users query failed', error);
    }
  }

  async create(user: CreateUserDto): Promise<UserEntity> {
    try {
      const { rows } = await this.database.query<UserRow>(
        `INSERT INTO public.users (username, email)
         VALUES ($1, $2)
         RETURNING id, username AS name, email, created_at`,
        [user.name, user.email],
      );
      return this.toUserEntity(rows[0]);
    } catch (error) {
      this.throwDatabaseError('PostgreSQL user insert failed', error);
    }
  }

  async replace(id: string, user: UpdateUserDto): Promise<UserEntity> {
    try {
      const { rows } = await this.database.query<UserRow>(
        `UPDATE public.users
         SET username = $1, email = $2
         WHERE id = $3
         RETURNING id, username AS name, email, created_at`,
        [user.name, user.email, id],
      );
      if (rows.length === 0) {
        throw new NotFoundException(`User '${id}' was not found`);
      }
      return this.toUserEntity(rows[0]);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.throwDatabaseError('PostgreSQL user replacement failed', error);
    }
  }

  async patch(id: string, user: PatchUserDto): Promise<UserEntity> {
    const updates: string[] = [];
    const values: string[] = [];

    if (user.name !== undefined) {
      values.push(user.name);
      updates.push(`username = $${values.length}`);
    }
    if (user.email !== undefined) {
      values.push(user.email);
      updates.push(`email = $${values.length}`);
    }
    values.push(id);

    try {
      const { rows } = await this.database.query<UserRow>(
        `UPDATE public.users
         SET ${updates.join(', ')}
         WHERE id = $${values.length}
         RETURNING id, username AS name, email, created_at`,
        values,
      );
      if (rows.length === 0) {
        throw new NotFoundException(`User '${id}' was not found`);
      }
      return this.toUserEntity(rows[0]);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.throwDatabaseError('PostgreSQL user update failed', error);
    }
  }

  private toUserEntity(row: UserRow): UserEntity {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      created_at:
        row.created_at instanceof Date
          ? row.created_at.toISOString()
          : String(row.created_at),
    };
  }

  private throwDatabaseError(message: string, error: unknown): never {
    this.logger.error(
      message,
      error instanceof Error ? error.stack : String(error),
    );
    throw new InternalServerErrorException('Unable to process users request');
  }
}
