import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiPath } from "~/libs/enums/enums.js";
import {
  DroneUpdateItemRequestDto,
  DroneUpdateItemResponseDto,
  type DroneCreateRequestDto,
  type DroneCreateResponseDto,
  type DroneGetAllResponseDto,
} from "./libs/types/types.js";
import { DroneService } from "./drone.service.js";
import { BodyValidationSchema } from "~/libs/packages/validation/validation.js";
import {
  droneCreateItemValidationSchema,
  droneUpdateItemValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";
import { DroneApiPath } from "./libs/enums/enums.js";

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

  @Post()
  @BodyValidationSchema(droneCreateItemValidationSchema)
  public async create(
    @Body() payload: DroneCreateRequestDto,
  ): Promise<DroneCreateResponseDto> {
    const drone = await this.droneService.create(payload);

    return drone;
  }

  @Put(DroneApiPath.$DRONE_ID)
  @BodyValidationSchema(droneUpdateItemValidationSchema)
  public async update(
    @Param("droneId") droneId: string,
    @Body() payload: DroneUpdateItemRequestDto,
  ): Promise<DroneUpdateItemResponseDto> {
    const drone = await this.droneService.update(Number(droneId), payload);

    return drone;
  }
}

export { DroneController };
