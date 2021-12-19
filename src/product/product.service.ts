import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/category/category.schema';
import { CategoryService } from 'src/category/category.service';
import { CreateProductInput } from './product.interface';
import { UpdateProductInput } from './product.interface';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    private readonly categoryService: CategoryService,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(input: CreateProductInput) {
    try {
      const categories: Category[] = [];
      for (let i = 0; i < input.categories.length; i++) {
        categories.push(
          await this.categoryService.findByName(input.categories[i]),
        );
      }
      const product: ProductDocument = new this.productModel({
        ...input,
        categories,
      });
      await product.save();
      return {
        ...product.toJSON(),
      };
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async findAll() {
    return this.productModel.find({ deleted: false });
  }

  async findOne(_id: string) {
    return this.productModel.findOne({ _id, deleted: false });
  }

  async update(id: string, { ...updateInput }: UpdateProductInput) {
    try {
      const product = await this.productModel.findByIdAndUpdate(
        id,
        {
          $set: {
            ...updateInput,
            updated_at: new Date(),
          },
        },
        {
          new: true,
        },
      );

      return product.toJSON();
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async remove(id: string) {
    return this.update(id, { id, deleted: true });
  }

  async getByQuarter(year = 2021) {
    return [
      await this.productModel.count({
        created_at: {
          $gte: new Date(year, 1, 1),
          $lt: new Date(year, 3, 1),
        },
      }),
      await this.productModel.count({
        created_at: {
          $gte: new Date(year, 3, 1),
          $lt: new Date(year, 6, 1),
        },
      }),
      await this.productModel.count({
        created_at: {
          $gte: new Date(year, 6, 1),
          $lt: new Date(year, 9, 1),
        },
      }),
      await this.productModel.count({
        created_at: {
          $gte: new Date(year, 9, 1),
          $lt: new Date(year, 12, 1),
        },
      }),
    ];
  }
}
