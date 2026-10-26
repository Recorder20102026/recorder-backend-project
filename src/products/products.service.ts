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
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @Inject(SUPABASE_CLIENT)
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  async findAll() {
    const products: Database['public']['Tables']['products']['Row'][] = [];
    let offset = 0;
    let totalCount: number | null = null;

    do {
      const { data, error, count } = await this.supabase
        .from('products')
        .select('id, name, price, stock, created_at', { count: 'exact' })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) {
        this.logger.error(`Supabase products query failed: ${error.message}`);
        throw new InternalServerErrorException('Unable to retrieve products');
      }

      if (data === null || count === null) {
        throw new InternalServerErrorException(
          'Supabase returned incomplete product data',
        );
      }

      if (data.length === 0 && offset < count) {
        throw new InternalServerErrorException(
          'Supabase product pagination made no progress',
        );
      }

      products.push(...data);
      offset += data.length;
      totalCount = count;
    } while (offset < totalCount);

    return products;
  }

  async findByName(name: string) {
    const products: Database['public']['Tables']['products']['Row'][] = [];
    let offset = 0;
    let totalCount: number | null = null;

    do {
      const { data, error, count } = await this.supabase
        .from('products')
        .select('id, name, price, stock, created_at', { count: 'exact' })
        .eq('name', name)
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) {
        this.logger.error(
          `Supabase product name query failed: ${error.message}`,
        );
        throw new InternalServerErrorException(
          'Unable to retrieve products by name',
        );
      }

      if (data === null || count === null) {
        throw new InternalServerErrorException(
          'Supabase returned incomplete product data',
        );
      }

      if (data.length === 0 && offset < count) {
        throw new InternalServerErrorException(
          'Supabase product name pagination made no progress',
        );
      }

      products.push(...data);
      offset += data.length;
      totalCount = count;
    } while (offset < totalCount);

    return products;
  }
}
