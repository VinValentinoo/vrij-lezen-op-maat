import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Front-end en back-end draaien tijdens de PoC los van elkaar (aparte poorten)
  app.enableCors();

  // Globale validatie op basis van class-validator decorators in de DTO's
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // OpenAPI-specificatie: leidend voor het contract tussen front-end en back-end (NFR / rubric)
  const config = new DocumentBuilder()
    .setTitle('Vrij lezen op maat API')
    .setDescription('API voor leesprofiel, leesadvies, catalogus en leeslijst')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Back-end draait op http://localhost:${port}`);
  console.log(`OpenAPI-documentatie op http://localhost:${port}/api/docs`);
}
bootstrap();
