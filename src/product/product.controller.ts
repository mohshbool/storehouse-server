import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { CreateProductInput, UpdateProductInput } from './product.interface';
import { ProductService } from './product.service';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  async create(input: CreateProductInput) {
    return this.productService.create(input);
  }

  @Post('update')
  async update(input: UpdateProductInput) {
    return this.productService.update(input.id, input);
  }

  @Get('all')
  async findAll() {
    return this.productService.findAll();
  }
}
