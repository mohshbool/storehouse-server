import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { UserDocument } from 'src/user/user.schema';
import { UpdateTokenInput } from './token.interface';
import { Token, TokenDocument } from './token.schema';

@Injectable()
export class TokenService {
  @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>;

  async create(user: UserDocument) {
    try {
      await this.tokenModel.update(
        { user, valid: true },
        { $set: { valid: false } },
        { multi: true },
      );

      const token = await hash(`${user.id}${moment().toString()}}`, 10);

      const newToken = new this.tokenModel({
        token,
        user,
        expiry_date: moment().add(7, 'days'),
      });

      await newToken.save();

      return token;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Something went wrong');
    }
  }

  async findOneByToken(token: string) {
    return this.tokenModel.findOne({ token, valid: true });
  }

  async update(id: string, updateTokenInput: UpdateTokenInput) {
    try {
      return this.tokenModel.findByIdAndUpdate(
        id,
        {
          $set: {
            ...updateTokenInput,
            updated_at: new Date(),
          },
        },
        {
          new: true,
        },
      );
    } catch {
      throw new BadRequestException('Something went wrong');
    }
  }

  async refreshToken(user: UserDocument) {
    return this.create(user);
  }
}
