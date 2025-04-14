import { Inject, Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { DroneService } from "../drones/drone.service.js";
import { MapEvents } from "./libs/enums/enums.js";
import { RedisClientType } from "redis";
import { REDIS_CLIENT_KEY } from "~/libs/packages/redis/redis.js";
import { DroneLocation } from "../drones/drones.js";

@Injectable()
class MapService {
  private readonly eventEmitter: EventEmitter2;
  private positionsUpdatingIntervalId: NodeJS.Timeout | null = null;
  private readonly droneService: DroneService;
  private readonly deltaIterationTime = 1500;

  public constructor(eventEmitter: EventEmitter2, droneSerivce: DroneService) {
    this.eventEmitter = eventEmitter;
    this.droneService = droneSerivce;
  }

  @OnEvent(MapEvents.DRONES_START_UPDATING_LOCATIONS)
  private async _startUpdatingDronesLocations() {
    if (this.positionsUpdatingIntervalId) return;

    this.positionsUpdatingIntervalId = setInterval(async () => {
      const drones = await this.getDronesLocation();
      const dronesWithUpdatedLocation = new Array<any>();

      for (const drone of drones) {
        const { id, destination, location } = drone;

        const droneUpdatedLocation = this.calcaulateNewLocation(
          location,
          destination,
        );

        const droneWithNewLocation = await this.droneService.updateLocation({
          id,
          altitude: droneUpdatedLocation.latitude,
          latitude: droneUpdatedLocation.longitude,
          longitude: drone.location.latitude,
        });

        dronesWithUpdatedLocation.push({
          ...droneWithNewLocation,
          destination,
          location: droneUpdatedLocation,
        });
      }

      this.eventEmitter.emit(
        MapEvents.DRONES_LOCATION_UPDATE,
        dronesWithUpdatedLocation,
      );
    }, this.deltaIterationTime);
  }

  @OnEvent(MapEvents.DRONES_STOP_UPDATING_LOCATIONS)
  private async _stopUpdatingDronesLocations() {
    if (this.positionsUpdatingIntervalId) {
      clearInterval(this.positionsUpdatingIntervalId);
    }

    this.positionsUpdatingIntervalId = null;
  }

  public async getDronesLocation() {
    const drones = await this.droneService.findAllWithLocation();

    return drones;
  }

  private calcaulateNewLocation(
    currentDroneState: DroneLocation,
    destination: DroneLocation,
  ) {
    const deltaLatitude =
      parseFloat(destination.latitude) - parseFloat(currentDroneState.latitude);
    const deltaLongitude =
      parseFloat(destination.longitude) -
      parseFloat(currentDroneState.longitude);

    const totalDistance = Math.hypot(deltaLatitude, deltaLongitude);
    const distToTravel = 1 * this.deltaIterationTime;

    if (distToTravel >= totalDistance) {
      return destination;
    }

    const fraction = distToTravel / totalDistance;

    const nextLatitude =
      parseFloat(currentDroneState.latitude) + deltaLatitude * fraction;
    const nextLongitude =
      parseFloat(currentDroneState.longitude) + deltaLongitude * fraction;

    return {
      latitude: nextLatitude.toFixed(4),
      longitude: nextLongitude.toFixed(4),
    };
  }
}

export { MapService };
