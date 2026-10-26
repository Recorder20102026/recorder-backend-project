import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../database.types';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';

const PAGE_SIZE = 1000;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  async findAll() {
    const users: Database['public']['Tables']['users']['Row'][] = [];
    let offset = 0;
    let totalCount: number | null = null;

    do {
      const { data, error, count } = await this.supabase
        .from('users')
        .select('id, username, email, created_at', { count: 'exact' })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) {
        this.logger.error(`Supabase users query failed: ${error.message}`);
        throw new InternalServerErrorException('Unable to retrieve users');
      }

      if (data === null || count === null) {
        throw new InternalServerErrorException(
          'Supabase returned incomplete user data',
        );
      }

      if (data.length === 0 && offset < count) {
        throw new InternalServerErrorException(
          'Supabase user pagination made no progress',
        );
      }

      users.push(...data);
      offset += data.length;
      totalCount = count;
    } while (offset < totalCount);

    return users;
  }
}
