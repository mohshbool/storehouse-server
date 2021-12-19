import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { UpdateCategoryInput } from './category.interface';
import { CategoryService } from './category.service';

@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  async create(@Body() { name }: { name: string }) {
    return this.categoryService.create(name);
  }

  @Post('update')
  async update(@Body() input: UpdateCategoryInput) {
    return this.categoryService.update(input.id, input);
  }

  @Get('all')
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get('by-quarter')
  async getByQuarter(@Param('year') year: number) {
    return this.categoryService.getByQuarter(year);
  }
}
