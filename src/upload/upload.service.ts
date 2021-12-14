import { extname } from 'path';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Upload, UploadDocument } from './upload.schema';

interface ReturnValue {
  filename: string;
  thumbnail?: string;
}

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(Upload.name) readonly uploadModel: Model<UploadDocument>,
  ) {}

  async create(_upload: any) {
    const upload = new this.uploadModel({ ..._upload });
    return upload.save();
  }

  async findOne(id: number) {
    return this.uploadModel.findById(id);
  }

  renameFile(originalname: string): ReturnValue {
    const unique = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 32).toString(32))
      .join('');

    return {
      filename: `${originalname.split('.')[0]}-${unique}${
        extname(originalname) === '.heic' ? '.jpg' : extname(originalname)
      }`,
    };
  }
}
