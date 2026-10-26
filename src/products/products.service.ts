import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { QueryResultRow } from 'pg';
import { DatabaseService } from '../database/database.service';
import { ProductEntity } from './product.entity';

interface ProductRow extends QueryResultRow {
  id: string;
  name: string;
  price: number;
  stock: number;
  created_at: Date;
}

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly database: DatabaseService) {}

  async findAll(): Promise<ProductEntity[]> {
    try {
      const { rows } = await this.database.query<ProductRow>(
        'SELECT id, name, price::float8 AS price, stock, created_at FROM public.products',
      );
      return rows.map((row) => ({
        ...row,
        created_at: row.created_at.toISOString(),
      }));
    } catch (error) {
      this.logger.error(
        'PostgreSQL products query failed',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Unable to retrieve products');
    }
  }

  async findByName(name: string): Promise<ProductEntity[]> {
    try {
      const { rows } = await this.database.query<ProductRow>(
        'SELECT id, name, price::float8 AS price, stock, created_at FROM public.products WHERE name = $1',
        [name],
      );
      return rows.map((row) => ({
        ...row,
        created_at: row.created_at.toISOString(),
      }));
    } catch (error) {
      this.logger.error(
        'PostgreSQL product name query failed',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException(
        'Unable to retrieve products by name',
      );
    }
  }
}
