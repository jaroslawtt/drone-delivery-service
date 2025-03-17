import { Injectable } from "@nestjs/common";
import { DroneEntity } from "./drone.entity.js";
import { DroneRepository } from "./drone.repository.js";
import { type DroneUpdateLocation, type Drone } from "./libs/types/types.js";
import { IService } from "~/libs/interfaces/interfaces.js";

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

  public async updateLocation(payload: DroneUpdateLocation) {
    const { id, latitude, longitude, altitude, speed } = payload;

    const drone = await this.droneRepository.updateLocation(
      DroneEntity.initialize({
        id,
        altitude,
        latitude,
        longitude,
        speed,
        batteryCapacity: null,
        maxAltitude: null,
        maxSpeed: null,
        model: null,
        serialNumber: null,
        status: null,
        weightCapacity: null,
        createdAt: null,
        updatedAt: null,
      }),
    );

    return drone.toObject();
  }

  public async findLocation(droneId: Drone["id"]) {
    const drone = await this.droneRepository.find(droneId);

    if (!drone) {
      return null;
    }

    return drone.locationData;
  }
}

export { DroneService };
