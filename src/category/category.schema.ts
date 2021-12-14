import * as moment from 'moment';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  id: string;

  @Prop()
  name: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: moment })
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
