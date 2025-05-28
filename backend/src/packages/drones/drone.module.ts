import { Module } from "@nestjs/common";
import { DroneRepository } from "./drone.repository.js";
import { DroneService } from "./drone.service.js";

@Module({
  imports: [],
  providers: [DroneService, DroneRepository],
  exports: [DroneService],
})
class DroneModule {}

export { DroneModule };
