import * as moment from 'moment';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Upload } from 'src/upload/upload.schema';

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

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Upload.name,
    autopopulate: true,
  })
  icon: Upload;

  @Prop({ default: false })
  deleted: boolean;

  @Prop({ default: moment })
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
