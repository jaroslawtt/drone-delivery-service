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
import { ConfigService } from "@nestjs/config";

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
  const configService = app.get(ConfigService);

  app.setGlobalPrefix("api/v1/");
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Accept, Authorization",
    credentials: true,
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
    .setTitle("Drone Delivery Service API")
    .setDescription("The Drone Delivery Service API description")
    .setVersion("1.0")
    .addTag("Drone Delivery Service")
    .addTag("Drones")
    .addTag("Delivery Service")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/v1/docs", app, document);

  app.enableShutdownHooks();
  app.useLogger(app.get(Logger));
  app.register(fastifyCookie, {} as FastifyCookieOptions);

  try {
    console.log(
      `Trying to start server on port ${configService.get("PORT") ?? 3001}...`,
    );

    await app.listen({
      port: configService.get("PORT") ?? 3001,
      host: "localhost",
    });

    return void console.log("server started");
  } catch (error) {
    console.log(`Trying to start server on port 5432...`);

    return void (await app.listen({
      port: 3001,
      host: "localhost",
    }));
  }
};

bootstrap();
