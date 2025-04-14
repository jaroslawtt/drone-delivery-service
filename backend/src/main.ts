import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";
import { HttpException, HttpStatus } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { FastifySchema } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { Logger } from "nestjs-pino";
import { ZodSchema } from "zod";
import { ResponseMappingInterceptor } from "./libs/packages/comom/interceptors/response-mapping.interceptor.js";
import { AppModule } from "~/libs/packages/app/app.js";
import {
  ROUTE_BODY_VALIDATION_SCHEMA_KEY,
  ROUTE_PARAMS_VALIDATION_SCHEMA_KEY,
} from "~/libs/packages/validation/validation.js";

const bootstrap = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      ajv: {
        customOptions: {
          allErrors: true,
        },
      },
    }),
  );

  app.setGlobalPrefix("api/v1/");
  app.enableCors({
    origin: "*",
  });

  app
    .getHttpAdapter()
    .getInstance()
    .setValidatorCompiler(validatorCompiler)
    .setSerializerCompiler(serializerCompiler)
    .setSchemaErrorFormatter((errors) => {
      return new HttpException(
        errors.map((error) => error.message).join("\n"),
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    })
    .addHook("onRoute", (routeOptions) => {
      const validationSchema: FastifySchema = {};

      const bodySchema = Reflect.getMetadata(
        ROUTE_BODY_VALIDATION_SCHEMA_KEY,
        routeOptions.handler,
      ) as ZodSchema | undefined;
      const paramsSchema = Reflect.getMetadata(
        ROUTE_PARAMS_VALIDATION_SCHEMA_KEY,
        routeOptions.handler,
      ) as ZodSchema | undefined;

      if (bodySchema) {
        validationSchema.body = bodySchema;
      }

      if (paramsSchema) {
        validationSchema.params = paramsSchema;
      }

      routeOptions.schema = validationSchema;
    });

  app.useGlobalInterceptors(new ResponseMappingInterceptor());

  const config = new DocumentBuilder()
    .setTitle("SkyPorter API")
    .setDescription("The SkyPorter API description")
    .setVersion("1.0")
    .addTag("SkyPorter")
    .addTag("Drones")
    .addTag("Delivery Service")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/v1/docs", app, document);

  app.enableShutdownHooks();
  app.useLogger(app.get(Logger));
  app.register(fastifyCookie, {} as FastifyCookieOptions);

  return void (await app.listen({
    port: 3001,
    host: "localhost",
  }));
};

bootstrap();
