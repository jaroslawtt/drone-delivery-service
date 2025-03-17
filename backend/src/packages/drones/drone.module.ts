import { Module } from "@nestjs/common";
import { DroneRepository } from "./drone.repository.js";
import { DroneService } from "./drone.service.js";

@Module({
  providers: [DroneService, DroneRepository],
})
class DroneModule {}

export { DroneModule };
