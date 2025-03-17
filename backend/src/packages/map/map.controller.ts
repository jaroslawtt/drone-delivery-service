import { Controller, Sse } from "@nestjs/common";
import { map, Observable, Subject } from "rxjs";
import { MapService } from "./map.service.js";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Controller("map")
class MapController {
  private readonly mapService: MapService;
  private readonly eventEmitter: EventEmitter2;

  public constructor(mapService: MapService, eventEmitter: EventEmitter2) {
    this.mapService = mapService;
    this.eventEmitter = eventEmitter;
  }

  @Sse("")
  public async dronesLocation(): Promise<Observable<unknown>> {
    const dronesLocationsSubject = new Subject();

    const dronesLocations = await this.mapService.getDronesLocation();

    dronesLocationsSubject.next(dronesLocations);

    this.eventEmitter.on("drones.location-update", (dronesUpdatedLocations) => {
      dronesLocationsSubject.next(dronesUpdatedLocations);
    });

    return dronesLocationsSubject.asObservable();
  }
}

export { MapController };
