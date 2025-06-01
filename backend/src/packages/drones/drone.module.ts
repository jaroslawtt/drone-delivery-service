import { Module } from "@nestjs/common";
import { DroneRepository } from "./drone.repository.js";
import { DroneService } from "./drone.service.js";
import { DroneController } from "./drone.controller.js";

@Module({
  imports: [],
  controllers: [DroneController],
  providers: [DroneService, DroneRepository],
  exports: [DroneService],
})
class DroneModule {}

export { DroneModule };
