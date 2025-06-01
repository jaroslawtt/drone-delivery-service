import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiPath } from "~/libs/enums/enums.js";
import { type DroneGetAllResponseDto } from "./libs/types/types.js";
import { DroneService } from "./drone.service.js";

@Controller(ApiPath.DRONES)
class DroneController {
  private readonly droneService: DroneService;

  public constructor(droneService: DroneService) {
    this.droneService = droneService;
  }

  @Get()
  public async findAll(): Promise<DroneGetAllResponseDto> {
    const drones = await this.droneService.findAll();

    return {
      items: drones,
    };
  }

  @Get(":droneId")
  public async findById(@Param("droneId") droneId: string) {
    const drone = await this.droneService.findById(Number(droneId));

    if (!drone) {
      throw new NotFoundException("Drone not found");
    }

    return drone;
  }
}

export { DroneController };
