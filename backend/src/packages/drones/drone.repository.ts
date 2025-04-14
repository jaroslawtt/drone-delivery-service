import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DroneEntity } from "./drone.entity.js";
import { type Drone } from "./libs/types/drone.type.js";
import { IRepository } from "~/libs/interfaces/interfaces.js";
import { relations } from "~/libs/packages/database/database.js";
import { BaseRepository } from "~/libs/packages/repository/repository.js";
import { REDIS_CLIENT_KEY } from "~/libs/packages/redis/redis.js";
import { RedisClientType } from "redis";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DroneLocation } from "./drones.js";
import { DroneStatus } from "./libs/enums/enums.js";

@Injectable()
class DroneRepository
  extends BaseRepository
  implements Pick<IRepository, "findAll">
{
  private readonly redisClient: RedisClientType;
  private readonly redisDronePositionHeshKey = "drone";

  public constructor(
    @Inject("DatabaseAsyncProvider")
    database: NodePgDatabase<typeof relations>,
    @Inject(REDIS_CLIENT_KEY) redisClient: RedisClientType,
  ) {
    super(database);

    this.redisClient = redisClient;
  }

  public async findAll(): Promise<DroneEntity[]> {
    const drones = await this.database.query.drones.findMany({
      with: {
        droneDetails: true,
        order: {
          with: {
            destination: true,
            entryPoint: true,
          },
        },
      },
    });
    const redisMulti = this.redisClient.multi();

    for (const drone of drones) {
      const dronePositionKey = this.getRedisDronePositionKey(drone.id);
      redisMulti.hGetAll(dronePositionKey);
    }

    const dronePositions =
      (await redisMulti.exec()) as unknown as Array<DroneLocation>;

    return drones.map((drone, index) => {
      const dronePosition = dronePositions.at(index) as DroneLocation;

      return DroneEntity.initialize({
        id: drone.id,
        serialNumber: drone.serialNumber,
        status: drone.status,
        model: drone.droneDetails.model,
        maxSpeed: drone.droneDetails.maxSpeed,
        maxAltitude: drone.droneDetails.maxAltitude,
        batteryCapacity: drone.droneDetails.batteryCapacity,
        weightCapacity: drone.droneDetails.weightCapacity,
        location: {
          altitude: dronePosition.altitude,
          latitude: dronePosition.latitude,
          longitude: dronePosition.longitude,
        },
        destination: {
          altitude: drone.order?.destination.altitude,
          latitude: drone.order?.destination.latitude,
          longitude: drone.order?.destination.longitude,
        },
        createdAt: drone.createdAt,
        updatedAt: drone.updatedAt,
      });
    });
  }

  public async updateLocation(payload: DroneEntity) {
    const { id } = payload.toObject();
    const { altitude, latitude, longitude } = payload.locationData;

    const dronePositionKey = this.getRedisDronePositionKey(id);
    await this.redisClient.hSet(dronePositionKey, {
      altitude,
      latitude,
      longitude,
    });

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
      destination: null,
      location: {
        altitude,
        latitude,
        longitude,
      },
      createdAt: drone.createdAt,
      updatedAt: drone.updatedAt,
    });
  }

  public async find(droneId: Drone["id"]): Promise<DroneEntity | null> {
    const drone = await this.database.query.drones.findFirst({
      where: eq(relations.drones.id, droneId),
      with: {
        droneDetails: true,
      },
    });
    const droneLocationData = await this.redisClient.hGetAll(
      this.getRedisDronePositionKey(droneId),
    );

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
      location: null,
      destination: null,
      createdAt: drone.createdAt,
      updatedAt: drone.updatedAt,
    });
  }

  private getRedisDronePositionKey(droneId: Drone["id"]): string {
    return `${this.redisDronePositionHeshKey}:${droneId}`;
  }
}

export { DroneRepository };
