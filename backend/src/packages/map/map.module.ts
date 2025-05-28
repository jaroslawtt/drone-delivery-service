import { Module } from "@nestjs/common";
import { MapController } from "./map.controller.js";
import { MapService } from "./map.service.js";
import { DroneModule } from "../drones/drone.module.js";
import { MapRepository } from "./map.repository.js";
import { RedisModule } from "~/libs/packages/redis/redis.js";
import { OrderModule } from "../orders/orders.js";

@Module({
  controllers: [MapController],
  providers: [MapService, MapRepository],
  imports: [DroneModule, RedisModule, OrderModule],
})
class MapModule {}

export { MapModule };
