import { Module } from "@nestjs/common";
import { MapController } from "./map.controller.js";
import { MapService } from "./map.service.js";
import { DroneModule } from "../drones/drone.module.js";

@Module({
  controllers: [MapController],
  providers: [MapService],
  imports: [DroneModule],
})
class MapModule {}

export { MapModule };
