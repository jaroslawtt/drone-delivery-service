import { Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { DroneService } from "../drones/drone.service.js";

@Injectable()
class MapService {
  private readonly eventEmitter: EventEmitter2;
  private positionsUpdatingIntervalId: NodeJS.Timeout | null = null;

  private readonly droneService: DroneService;

  public constructor(eventEmitter: EventEmitter2, droneSerivce: DroneService) {
    this.eventEmitter = eventEmitter;
    this.droneService = droneSerivce;
  }

  @OnEvent("drones.start-updating-positions")
  private async startUpdatingDronesPositions() {
    this.positionsUpdatingIntervalId = setInterval(async () => {
      const drones = await this.getDronesLocation();

      this.eventEmitter.emit("drones.location-update", drones);
    }, 500);
  }

  @OnEvent("drones.stop-updating-positions")
  private async stopUpdatingDronesPositions() {
    if (this.positionsUpdatingIntervalId) {
      clearInterval(this.positionsUpdatingIntervalId);
    }

    this.positionsUpdatingIntervalId = null;
  }

  public async getDronesLocation() {
    return [];
  }
}

export { MapService };
