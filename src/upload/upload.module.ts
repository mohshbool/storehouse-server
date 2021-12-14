import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { Upload, UploadSchema } from './upload.schema';
import { HelpersModule } from 'src/helpers/helpers.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    HelpersModule,
    MongooseModule.forFeature([{ name: Upload.name, schema: UploadSchema }]),
  ],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [MongooseModule],
})
export class UploadModule {}
