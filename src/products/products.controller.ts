import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ProductEntity } from './product.entity';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({ type: [ProductEntity] })
  findAll(): Promise<ProductEntity[]> {
    return this.productsService.findAll();
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get products matching an exact name' })
  @ApiParam({ name: 'name', example: 'Notebook' })
  @ApiOkResponse({ type: [ProductEntity] })
  findByName(@Param('name') name: string): Promise<ProductEntity[]> {
    return this.productsService.findByName(name);
  }
}
