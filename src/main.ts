import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //set API
  app.setGlobalPrefix('api');

  //winston logger
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

  //OpenAPI Swagger
  const config = new DocumentBuilder()
    .setTitle('Borrow Books')
    .setDescription('The borrowing books API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('BorrowBooks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
