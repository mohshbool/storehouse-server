import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductInput } from './product.interface';
import { UpdateProductInput } from './product.interface';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(input: CreateProductInput) {
    try {
      const product: ProductDocument = new this.productModel(input);
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
}
