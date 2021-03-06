import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateCategoryInput } from './category.interface';
import { Category, CategoryDocument } from './category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(name: string) {
    const categoryCheck = await this.categoryModel.findOne({
      name,
      deleted: false,
    });

    if (categoryCheck) {
      throw new BadRequestException('Category already exists');
    }

    const category: CategoryDocument = new this.categoryModel({ name });

    try {
      await category.save();
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }

    return {
      ...category.toJSON(),
    };
  }

  async findAll() {
    return this.categoryModel.find({ deleted: false });
  }

  async findOne(_id: string) {
    return this.categoryModel.findOne({ _id, deleted: false });
  }

  async update(id: string, { ...updateInput }: UpdateCategoryInput) {
    if (!!(await this.categoryModel.findOne(updateInput))) {
      throw new BadRequestException('Name already in use');
    }
    try {
      const category = await this.categoryModel.findByIdAndUpdate(
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

      return category.toJSON();
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }

  async remove(id: string) {
    return this.update(id, { id, deleted: true });
  }

  async findByName(name: string) {
    return this.categoryModel.findOne({ name });
  }

  async getByQuarter(year = 2021) {
    return [
      await this.categoryModel.count({
        created_at: {
          $gte: new Date(year, 1, 1),
          $lt: new Date(year, 3, 1),
        },
      }),
      await this.categoryModel.count({
        created_at: {
          $gte: new Date(year, 3, 1),
          $lt: new Date(year, 6, 1),
        },
      }),
      await this.categoryModel.count({
        created_at: {
          $gte: new Date(year, 6, 1),
          $lt: new Date(year, 9, 1),
        },
      }),
      await this.categoryModel.count({
        created_at: {
          $gte: new Date(year, 9, 1),
          $lt: new Date(year, 12, 1),
        },
      }),
    ];
  }
}
