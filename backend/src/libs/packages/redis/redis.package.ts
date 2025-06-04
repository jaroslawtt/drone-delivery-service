import { Provider } from "@nestjs/common";
import { REDIS_CLIENT_KEY } from "./libs/constants.js";
import { ConfigService } from "@nestjs/config";
import { RedisClientOptions, RedisClientType } from "@redis/client";
import { createClient } from "redis";
import { PinoLogger } from "nestjs-pino";

const redisProvider: Provider = {
  provide: REDIS_CLIENT_KEY,
  inject: [ConfigService, PinoLogger],
  useFactory: async (
    configService: ConfigService,
    logger: PinoLogger,
  ): Promise<RedisClientType | never> => {
    const host = configService.get<string>("REDIS_HOST");
    const port = configService.get<number>("REDIS_PORT");
    const mode = configService.get<string>("MODE");

    const clientOptions: RedisClientOptions =
      mode === "development"
        ? {
            socket: {
              host,
              port,
              tls: false,
            },
          }
        : {
            url: `${configService.get<string>("REDIS_URL")}`,
          };

    const client = createClient(clientOptions);

    client.on("error", (err) => logger.error(err));
    client.on("connect", () => logger.info("Connected to Redis"));
    client.on("reconnecting", () => logger.info("Reconnecting to Redis..."));
    client.on("ready", () => logger.info("Redis client ready!"));

    try {
      await client.connect();

      return client as RedisClientType;
    } catch (err) {
      console.error("Redis err", err);
      throw new Error("Failed to connect to Redis");
    }
  },
};

export { redisProvider };
