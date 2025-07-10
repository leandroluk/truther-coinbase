import {NestFactory} from '@nestjs/core';
import {type NestExpressApplication} from '@nestjs/platform-express';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {DomainErrorFilter} from '@repo/nest-common';
import {LoggerService} from '@repo/nest-logger';
import helmet from 'helmet';
import {AppEnv} from './app.env';
import {AppModule} from './app.module';

LoggerService.setAppName('api');

export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const appEnv = app.get(AppEnv);
  const loggerService = await app.resolve(LoggerService);

  app.disable('x-powered-by');
  app.setGlobalPrefix(appEnv.APPS_API_PREFIX);
  app.useLogger(loggerService);
  app.useGlobalFilters(new DomainErrorFilter());
  app.enableCors();
  app.use(helmet({contentSecurityPolicy: false}));

  const config = new DocumentBuilder()
    .setTitle('Truther Coingecko - API')
    .setDescription('Project developed as tech challenge for Truther Company')
    .setVersion('1.0.0')
    .addBearerAuth()
    .setExternalDoc('Github', 'https://github.com/leandroluk/truther-coingecko')
    .setContact('Leandro Santiago Gomes', 'leandroluk@gmail.com', 'https://www.linkedin.com/in/leandroluk')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(appEnv.APPS_API_PREFIX, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(appEnv.APPS_API_PORT);

  loggerService.log(`✅ server started on port ${appEnv.APPS_API_PORT}`);
}
void bootstrap();
