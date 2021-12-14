import { Document, Schema as MongooseSchema } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import * as moment from 'moment';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop()
  token: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    autopopulate: true,
  })
  user: User;

  @Prop({ default: true })
  valid: boolean;

  @Prop()
  expiry_date: Date;

  @Prop({ default: moment })
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
