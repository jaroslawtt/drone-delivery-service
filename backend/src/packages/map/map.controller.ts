import { Controller, Sse } from "@nestjs/common";
import { fromEvent, map, Observable } from "rxjs";
import { MapService } from "./map.service.js";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { MapEvents } from "./libs/enums/enums.js";
import { PublicRoute } from "~/libs/packages/routes/public-route.decorator.js";
import { ExcludeFromResponseMapping } from "~/libs/packages/comom/decorators/decorators.js";
import { type MapGetAllItemReponseDto } from "./libs/types/types.js";

@Controller("map")
class MapController {
  private readonly eventEmitter: EventEmitter2;

  public constructor(eventEmitter: EventEmitter2) {
    this.eventEmitter = eventEmitter;
  }

  @Sse("")
  @PublicRoute()
  @ExcludeFromResponseMapping()
  public dronesLocation(): Observable<MessageEvent<MapGetAllItemReponseDto>> {
    this.eventEmitter.emit(MapEvents.DRONES_START_UPDATING_LOCATIONS);

    return fromEvent(this.eventEmitter, MapEvents.DRONES_LOCATION_UPDATE).pipe(
      map((data) => {
        return { data } as MessageEvent<MapGetAllItemReponseDto>;
      }),
    );
  }
}

export { MapController };
