import { Injectable } from "@nestjs/common";
import { DroneRepository } from "./drone.repository.js";
import { type Drone, type DroneUpdate } from "./libs/types/types.js";
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

  public async update(droneId: Drone["id"], payload: DroneUpdate) {
    const { status, batteryLevel } = payload;

    const drone = await this.droneRepository.update(
      DroneEntity.initialize({
        id: droneId,
        status,
        batteryLevel,
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

    if (!drone) {
      return null;
    }
  }

  public async getDroneOrderDestination(droneId: Drone["id"]) {
    return await this.droneRepository.getDroneOrderDestination(droneId);
  }
}

export { DroneService };
