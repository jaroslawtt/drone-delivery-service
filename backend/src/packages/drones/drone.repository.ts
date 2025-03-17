import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DroneEntity } from "./drone.entity.js";
import { type Drone } from "./libs/types/drone.type.js";
import { IRepository } from "~/libs/interfaces/interfaces.js";
import { relations } from "~/libs/packages/database/database.js";
import { BaseRepository } from "~/libs/packages/repository/repository.js";

@Injectable()
class DroneRepository
  extends BaseRepository
  implements Pick<IRepository, "findAll">
{
  public async findAll(): Promise<DroneEntity[]> {
    const drones = await this.database.query.drones.findMany({
      with: {
        droneDetails: true,
        droneLocation: true,
      },
    });

    return drones.map((drone) =>
      DroneEntity.initialize({
        id: drone.id,
        serialNumber: drone.serialNumber,
        status: drone.status,
        model: drone.droneDetails.model,
        maxSpeed: drone.droneDetails.maxSpeed,
        maxAltitude: drone.droneDetails.maxAltitude,
        batteryCapacity: drone.droneDetails.batteryCapacity,
        weightCapacity: drone.droneDetails.weightCapacity,
        latitude: drone.droneLocation.latitude,
        longitude: drone.droneLocation.longitude,
        altitude: drone.droneLocation.altitude,
        speed: drone.droneLocation.speed,
        createdAt: drone.createdAt,
        updatedAt: drone.updatedAt,
      }),
    );
  }

  public async updateLocation(payload: DroneEntity) {
    const { id } = payload.toObject();
    const { altitude, latitude, longitude, speed } = payload.locationData;

    await this.database
      .update(relations.droneLocation)
      .set({
        altitude,
        latitude,
        longitude,
        speed,
      })
      .where(eq(relations.droneLocation.droneId, id));

    const drone = (await this.database.query.drones.findFirst({
      where: eq(relations.drones.id, id),
      with: {
        droneDetails: true,
      },
    }))!;

    return DroneEntity.initialize({
      id: drone.id,
      serialNumber: drone.serialNumber,
      status: drone.status,
      model: drone.droneDetails.model,
      maxSpeed: drone.droneDetails.maxSpeed,
      maxAltitude: drone.droneDetails.maxAltitude,
      batteryCapacity: drone.droneDetails.batteryCapacity,
      weightCapacity: drone.droneDetails.weightCapacity,
      latitude,
      longitude,
      altitude,
      speed,
      createdAt: drone.createdAt,
      updatedAt: drone.updatedAt,
    });
  }

  public async find(droneId: Drone["id"]): Promise<DroneEntity | null> {
    const drone = await this.database.query.drones.findFirst({
      where: eq(relations.drones.id, droneId),
      with: {
        droneLocation: true,
        droneDetails: true,
      },
    });

    if (!drone) {
      return null;
    }

    return DroneEntity.initialize({
      id: drone.id,
      serialNumber: drone.serialNumber,
      status: drone.status,
      model: drone.droneDetails.model,
      maxSpeed: drone.droneDetails.maxSpeed,
      maxAltitude: drone.droneDetails.maxAltitude,
      batteryCapacity: drone.droneDetails.batteryCapacity,
      weightCapacity: drone.droneDetails.weightCapacity,
      latitude: drone.droneLocation.latitude,
      longitude: drone.droneLocation.longitude,
      altitude: drone.droneLocation.altitude,
      speed: drone.droneLocation.speed,
      createdAt: drone.createdAt,
      updatedAt: drone.updatedAt,
    });
  }
}

export { DroneRepository };
