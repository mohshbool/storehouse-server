import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { UpdateCategoryInput } from './category.interface';
import { CategoryService } from './category.service';

@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  async create(name: string) {
    return this.categoryService.create(name);
  }

  @Post('update')
  async update(input: UpdateCategoryInput) {
    return this.categoryService.update(input.id, input);
  }

  @Get('all')
  async findAll() {
    return this.categoryService.findAll();
  }
}
