import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { CodeModule } from './code/code.module';
import { HelpersModule } from './helpers/helpers.module';
import { ProductModule } from './product/product.module';
import { TokenModule } from './token/token.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/storehouse', {
      connectionFactory: (connection) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      },
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'sagerstorehouseshbool@gmail.com',
          pass: 'shbool12345',
        },
      },
      defaults: {
        from: 'Sager Storehouse <sagerstorehouseshbool@gmail.com>',
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'uploads'),
      serveRoot: '/public',
      exclude: ['/api*'],
    }),
    TokenModule,
    CodeModule,
    UploadModule,
    HelpersModule,
    UserModule,
    CategoryModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
