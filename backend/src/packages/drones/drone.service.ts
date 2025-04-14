import { Injectable } from "@nestjs/common";
import { DroneEntity } from "./drone.entity.js";
import { DroneRepository } from "./drone.repository.js";
import { type DroneLocation, type Drone } from "./libs/types/types.js";
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

  public async findAllWithLocation() {
    const drones = await this.droneRepository.findAll();

    return drones.map((drone) => ({
      ...drone.toObject(),
      ...drone.details,
      destination: drone.destinationData,
      location: drone.locationData,
    }));
  }

  public async updateLocation(payload: DroneLocation & { id: Drone["id"] }) {
    const { id, latitude, longitude, altitude } = payload;

    const drone = await this.droneRepository.updateLocation(
      DroneEntity.initialize({
        id,
        location: {
          altitude,
          latitude,
          longitude,
        },
        destination: null,
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
