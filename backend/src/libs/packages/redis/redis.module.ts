import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { redisProvider } from "./redis.package.js";

@Module({
  imports: [ConfigModule],
  providers: [redisProvider],
  exports: [redisProvider],
})
class RedisModule {}

export { RedisModule };
