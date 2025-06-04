import { Injectable } from "@nestjs/common";
import { DroneRepository } from "./drone.repository.js";
import {
  DroneCreateRequestDto,
  DroneUpdateItemRequestDto,
  type Drone,
} from "./libs/types/types.js";
import { IService } from "~/libs/interfaces/interfaces.js";
import { DroneStatus } from "./libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import { DroneEntity } from "./drone.entity.js";
import { type Order } from "../orders/libs/types/types.js";

@Injectable()
class DroneService implements Pick<IService, "findAll"> {
  private readonly droneRepository: DroneRepository;

  public constructor(droneRepository: DroneRepository) {
    this.droneRepository = droneRepository;
  }

  public async findAll() {
    const drones = await this.droneRepository.findAll();

    return drones.map((drone) => drone.toObject());
  }

  public async findById(id: Drone["id"]) {
    const drone = await this.droneRepository.findById(id);

    if (!drone) {
      return null;
    }

    return drone.toObject();
  }

  public async find(parameters: {
    status?: ValueOf<typeof DroneStatus>;
    orderId?: Order["id"] | null;
  }) {
    const drones = await this.droneRepository.find(parameters);

    return drones.map((drone) => drone.toObject());
  }

  public async update(
    droneId: Drone["id"],
    payload: DroneUpdateItemRequestDto,
  ) {
    const { status } = payload;

    const drone = await this.droneRepository.update(
      DroneEntity.initialize({
        id: droneId,
        status,
        batteryLevel: null,
        batteryCapacity: null,
        maxAltitude: null,
        maxSpeed: null,
        model: null,
        serialNumber: null,
        weightCapacity: null,
        orderId: null,
        createdAt: null,
        updatedAt: null,
      }),
    );

    return drone.toObject();
  }

  public async create(payload: DroneCreateRequestDto) {
    const { model, serialNumber } = payload;

    const drone = await this.droneRepository.create(
      DroneEntity.initializeNew({
        model,
        serialNumber,
        status: DroneStatus.OFFLINE,
        batteryLevel: 100,
        batteryCapacity: "100",
        maxSpeed: "100",
        maxAltitude: "100",
        weightCapacity: "100",
        orderId: null,
      }),
    );

    return drone.toObject();
  }

  public async getDroneOrderDestination(droneId: Drone["id"]) {
    return await this.droneRepository.getDroneOrderDestination(droneId);
  }
}

export { DroneService };
