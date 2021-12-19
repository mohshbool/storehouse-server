import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { CreateProductInput, UpdateProductInput } from './product.interface';
import { ProductService } from './product.service';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  async create(@Body() input: CreateProductInput) {
    return this.productService.create(input);
  }

  @Post('update')
  async update(@Body() input: UpdateProductInput) {
    return this.productService.update(input.id, input);
  }

  @Get('all')
  async findAll() {
    return this.productService.findAll();
  }

  @Get('by-quarter')
  async getByQuarter(@Param('year') year: number) {
    return this.productService.getByQuarter(year);
  }
}
