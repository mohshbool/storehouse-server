import * as moment from 'moment';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop({ private: true })
  password: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: moment })
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
