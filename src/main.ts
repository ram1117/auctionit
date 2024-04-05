import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          [error.property]: Object.values(error.constraints),
        }));

        return new BadRequestException(result);
      },
    }),
  );
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  await app.listen(3001);
}
bootstrap();
