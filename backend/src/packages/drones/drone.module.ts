import { Module } from "@nestjs/common";
import { DroneRepository } from "./drone.repository.js";
import { DroneService } from "./drone.service.js";
import { RedisModule } from "~/libs/packages/redis/redis.module.js";

@Module({
  imports: [RedisModule],
  providers: [DroneService, DroneRepository],
  exports: [DroneService],
})
class DroneModule {}

export { DroneModule };
