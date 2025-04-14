import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { LoggerModule } from "nestjs-pino";
import { configOptions } from "../config/config.options.js";
import { DatabaseModule } from "../database/database.js";
import { authGuardProvider, AuthModule } from "~/packages/auth/auth.js";
import { OrderModule } from "~/packages/orders/orders.js";
import { UserModule } from "~/packages/users/users.js";
import { DroneModule } from "~/packages/drones/drones.js";
import { MapModule } from "~/packages/map/map.js";
import { RedisModule } from "../redis/redis.js";

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: true,
      },
    }),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UserModule,
    OrderModule,
    DroneModule,
    MapModule,
    RedisModule,
  ],
  controllers: [],
  providers: [authGuardProvider],
})
class AppModule {}

export { AppModule };
