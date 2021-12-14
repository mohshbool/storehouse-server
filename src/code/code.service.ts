import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { UserDocument } from 'src/user/user.schema';
import { Code, CodeDocument } from './code.schema';
import { UpdateCodeInput } from './code.interface';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CodeService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectModel(Code.name) private readonly codeModel: Model<CodeDocument>,
  ) {}

  async send(user: UserDocument) {
    const code = this.generate();

    const codeDocument = new this.codeModel({
      code,
      user,
      expiry_date: moment().add(10, 'minute'),
    });
    await codeDocument.save();

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Storehouse: Password Reset',
      text: `Dear ${user.name},\nCode for your password reset is:\n${code}\nRegards,\nSager Storehouse`,
    });

    return code;
  }

  async findAll() {
    return this.codeModel.find();
  }

  async findOne(id: string) {
    return this.codeModel.findById(id);
  }

  update(id: string, updateCodeInput: UpdateCodeInput) {
    try {
      return this.codeModel.findByIdAndUpdate(
        id,
        {
          $set: {
            ...updateCodeInput,
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

  private generate() {
    if (process.env.NODE_ENV === 'production') {
      // return Math.floor(Math.random() * 90000) + 10000;
    }
    return 11111;
  }

  async verify(user: UserDocument, code: number) {
    return this.codeModel.findOneAndUpdate(
      { user, code, valid: true, expiry_date: { $gt: new Date() } },
      { $set: { valid: false, updated_at: new Date() } },
      { new: true },
    );
  }
}
