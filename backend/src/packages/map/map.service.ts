import { Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { DroneService } from "../drones/drone.service.js";
import { MapEvents } from "./libs/enums/enums.js";
import { DroneStatus } from "../drones/libs/enums/enums.js";
import {
  type MapLocation,
  type MapGetAllItemReponseDto,
} from "./libs/types/types.js";
import { MapRepository } from "./map.repository.js";
import { OrderService } from "../orders/order.service.js";
import { OrderStatus } from "../orders/libs/enums/enums.js";

@Injectable()
class MapService {
  private readonly eventEmitter: EventEmitter2;
  private readonly droneService: DroneService;
  private readonly orderService: OrderService;
  private readonly mapRepository: MapRepository;

  private readonly deltaIterationTime = 1500;
  private readonly DRONE_SPEED_UNITS_PER_SECOND = 0.0003;
  private positionsUpdatingIntervalId: NodeJS.Timeout | null = null;
  private readonly DEFAULT_LOCATION: MapLocation = {
    latitude: "50.45",
    longitude: "30.52",
  };

  public constructor(
    eventEmitter: EventEmitter2,
    droneSerivce: DroneService,
    orderService: OrderService,
    mapRepository: MapRepository,
  ) {
    this.eventEmitter = eventEmitter;
    this.droneService = droneSerivce;
    this.mapRepository = mapRepository;
    this.orderService = orderService;
  }

  @OnEvent(MapEvents.DRONES_START_UPDATING_LOCATIONS)
  private async _startUpdatingDronesLocations() {
    if (this.positionsUpdatingIntervalId) return;

    this.positionsUpdatingIntervalId = setInterval(async () => {
      const drones = await this.droneService.find({
        status: DroneStatus.ONLINE,
      });
      const dronesWithUpdatedLocation = new Array<MapGetAllItemReponseDto>();

      for (const drone of drones) {
        const order = await this.orderService.findByDroneId(drone.id);

        let droneLocation = await this.mapRepository.findLocationByDroneId(
          drone.id,
        );
        let droneDestination: MapLocation = this.DEFAULT_LOCATION;

        if (order) {
          if (order.status !== OrderStatus.IN_TRANSIT) {
            droneDestination = order.entryPoint;
          } else {
            droneDestination = order.destination;
          }
        }

        if (!droneLocation) {
          await this.mapRepository.updateLocationByDroneId(
            drone.id,
            this.DEFAULT_LOCATION,
          );

          droneLocation = this.DEFAULT_LOCATION;
        }

        const droneUpdatedLocation = this.calcaulateNewLocation(
          droneLocation,
          droneDestination,
        );
        const hasDroneReachedDestination = this.hasDroneReachedDestination(
          droneUpdatedLocation,
          droneDestination,
        );

        if (hasDroneReachedDestination) {
          if (!order) {
            await this.droneService.update(drone.id, {
              status: DroneStatus.OFFLINE,
              serialNumber: drone.serialNumber,
              model: drone.model,
            });

            continue;
          } else {
            if (order.status === OrderStatus.IN_TRANSIT) {
              await Promise.all([
                this.orderService.update(order.id, {
                  clientId: order.clientId,
                  droneId: null,
                  weight: order.weight,
                  amount: order.amount,
                  status: OrderStatus.DELIVERED,
                }),
              ]);

              continue;
            } else {
              await Promise.all([
                this.orderService.update(order.id, {
                  clientId: order.clientId,
                  droneId: order.droneId,
                  weight: order.weight,
                  amount: order.amount,
                  status: OrderStatus.IN_TRANSIT,
                }),
              ]);
            }
          }
        }

        await this.mapRepository.updateLocationByDroneId(drone.id, {
          latitude: droneUpdatedLocation.latitude,
          longitude: droneUpdatedLocation.longitude,
        });

        dronesWithUpdatedLocation.push({
          id: drone.id,
          destination: droneDestination,
          location: droneUpdatedLocation,
          isDelivering: Boolean(order?.status === OrderStatus.IN_TRANSIT),
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

  private calcaulateNewLocation(
    currentDroneState: MapLocation,
    destination: MapLocation,
  ): MapLocation {
    const deltaLatitude =
      parseFloat(destination.latitude) - parseFloat(currentDroneState.latitude);
    const deltaLongitude =
      parseFloat(destination.longitude) -
      parseFloat(currentDroneState.longitude);

    const totalDistance = Math.hypot(deltaLatitude, deltaLongitude);

    if (totalDistance === 0) {
      return destination;
    }

    const distToTravel =
      this.DRONE_SPEED_UNITS_PER_SECOND * (this.deltaIterationTime / 1000.0);

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

  private hasDroneReachedDestination(
    currentDroneState: MapLocation,
    destination: MapLocation,
  ): boolean {
    const POSITION_THRESHOLD = 0.0001;

    const deltaLatitude = Math.abs(
      parseFloat(destination.latitude) - parseFloat(currentDroneState.latitude),
    );
    const deltaLongitude = Math.abs(
      parseFloat(destination.longitude) -
        parseFloat(currentDroneState.longitude),
    );

    return (
      deltaLatitude <= POSITION_THRESHOLD &&
      deltaLongitude <= POSITION_THRESHOLD
    );
  }
}

export { MapService };
