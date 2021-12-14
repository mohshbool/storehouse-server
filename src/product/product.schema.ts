import * as moment from 'moment';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from 'src/category/category.schema';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  quantity: number;

  @Prop()
  price: number;

  @Prop()
  image: string;

  @Prop([
    {
      type: MongooseSchema.Types.ObjectId,
      ref: Category.name,
      autopopulate: true,
    },
  ])
  categories: Category[];

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: moment })
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
