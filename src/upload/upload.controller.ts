import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { join, resolve } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';

import { UploadService } from './upload.service';
import { HelpersService } from 'src/helpers/helpers.service';
import { AuthGuard } from 'src/auth.guard';

export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  destination: string;
  filename: string;
  path: string;
}

const ROOT = resolve(__dirname, '../../public/uploads/');

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly helpersService: HelpersService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: File, @Body('key') key: string) {
    if (key !== 'sagerSTOREHOUSE@UPLAOD*KEY2021') return false;

    switch (file.mimetype) {
      case 'image/jpeg':
      case 'image/jpg':
        break;
      default:
        Logger.error(`Invalid file type => ${file.mimetype}`);
        throw new HttpException('Invalid file type!', HttpStatus.BAD_REQUEST);
    }

    const fileNewName = this.uploadService.renameFile(file.originalname);

    const filename = resolve(ROOT, fileNewName.filename);
    await this.helpersService.writeFileAsync(filename, file.buffer);

    return this.uploadService.create({
      ...fileNewName,
      type: file.mimetype,
    });
  }

  @Get(':image')
  @UseGuards(AuthGuard)
  async seeUploadedFile(@Param('image') image: string, @Res() res: Response) {
    return res.sendFile(image, {
      root: join(__dirname, '..', '..', 'public', 'uploads'),
    });
  }
}
