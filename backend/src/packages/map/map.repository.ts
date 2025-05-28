import { Inject, Injectable } from "@nestjs/common";
import { type RedisClientType } from "redis";
import { REDIS_CLIENT_KEY } from "~/libs/packages/redis/redis.js";
import { Drone } from "../drones/libs/types/types.js";
import { type MapLocation } from "./libs/types/types.js";

@Injectable()
class MapRepository {
  private readonly redisClient: RedisClientType;

  public constructor(@Inject(REDIS_CLIENT_KEY) redisClient: RedisClientType) {
    this.redisClient = redisClient;
  }

  public async findLocationByDroneId(
    droneId: Drone["id"],
  ): Promise<MapLocation | null> {
    const droneLocation = await this.redisClient.hGetAll(droneId.toString());

    if (!this.isMapLocation(droneLocation)) {
      return null;
    }

    return droneLocation;
  }

  public async updateLocationByDroneId(
    droneId: Drone["id"],
    location: MapLocation,
  ): Promise<void> {
    return void (await this.redisClient.hSet(droneId.toString(), location));
  }

  public async deleteLocationByDroneId(droneId: Drone["id"]): Promise<void> {
    return void (await this.redisClient.del(droneId.toString()));
  }

  private isMapLocation(obj: unknown): obj is MapLocation {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }

    return (
      obj &&
      typeof obj["longitude"] === "string" &&
      typeof obj["latitude"] === "string"
    );
  }
}

export { MapRepository };
