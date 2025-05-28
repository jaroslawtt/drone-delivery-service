import { Inject, Injectable } from "@nestjs/common";
import { eq, and, SQL, isNotNull, notInArray, inArray } from "drizzle-orm";
import { DroneEntity } from "./drone.entity.js";
import { type Drone } from "./libs/types/drone.type.js";
import { IRepository } from "~/libs/interfaces/interfaces.js";
import { relations } from "~/libs/packages/database/database.js";
import { BaseRepository } from "~/libs/packages/repository/repository.js";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DroneStatus } from "./libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import { MapLocation } from "../map/libs/types/types.js";
import { Order } from "../orders/libs/types/order.type.js";

@Injectable()
class DroneRepository
  extends BaseRepository
  implements Pick<IRepository, "findAll">
{
  public constructor(
    @Inject("DatabaseAsyncProvider")
    database: NodePgDatabase<typeof relations>,
  ) {
    super(database);
  }

  public async findAll(): Promise<DroneEntity[]> {
    const drones = await this.database.query.drones.findMany({
      with: {
        droneDetails: true,
        order: {
          columns: {
            id: true,
          },
        },
      },
    });

    return drones.map((drone) => {
      return DroneEntity.initialize({
        id: drone.id,
        serialNumber: drone.serialNumber,
        status: drone.status,
        model: drone.droneDetails.model,
        maxSpeed: drone.droneDetails.maxSpeed,
        maxAltitude: drone.droneDetails.maxAltitude,
        batteryCapacity: drone.droneDetails.batteryCapacity,
        weightCapacity: drone.droneDetails.weightCapacity,
        batteryLevel: drone.batteryLevel,
        orderId: drone.order?.id ?? null,
        createdAt: drone.createdAt,
        updatedAt: drone.updatedAt,
      });
    });
  }

  public async find(parameters: {
    status?: ValueOf<typeof DroneStatus>;
    orderId?: Order["id"] | null;
  }): Promise<DroneEntity[]> {
    const conditions: SQL[] = [];

    if (parameters?.status) {
      conditions.push(eq(relations.drones.status, parameters.status));
    }

    if (parameters && typeof parameters.orderId !== "undefined") {
      if (parameters.orderId === null) {
        const assignedDroneIdsSubquery = this.database
          .selectDistinct({ droneId: relations.orders.droneId })
          .from(relations.orders)
          .where(isNotNull(relations.orders.droneId));

        conditions.push(
          notInArray(relations.drones.id, assignedDroneIdsSubquery),
        );
      } else {
        const orderDroneIdSubquery = this.database
          .select({ droneId: relations.orders.droneId })
          .from(relations.orders)
          .where(eq(relations.orders.id, parameters.orderId));

        conditions.push(inArray(relations.drones.id, orderDroneIdSubquery));
      }
    }

    const drones = await this.database.query.drones.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        droneDetails: true,
        order: {
          columns: {
            id: true,
          },
        },
      },
    });

    return drones.map((drone) => {
      return DroneEntity.initialize({
        id: drone.id,
        serialNumber: drone.serialNumber,
        status: drone.status,
        model: drone.droneDetails.model,
        maxSpeed: drone.droneDetails.maxSpeed,
        maxAltitude: drone.droneDetails.maxAltitude,
        batteryCapacity: drone.droneDetails.batteryCapacity,
        weightCapacity: drone.droneDetails.weightCapacity,
        batteryLevel: drone.batteryLevel,
        orderId: drone.order?.id ?? null,
        createdAt: drone.createdAt,
        updatedAt: drone.updatedAt,
      });
    });
  }

  public async findById(droneId: Drone["id"]): Promise<DroneEntity | null> {
    const drone = await this.database.query.drones.findFirst({
      where: eq(relations.drones.id, droneId),
      with: {
        droneDetails: true,
        order: {
          columns: {
            id: true,
          },
        },
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
      batteryLevel: drone.batteryLevel,
      orderId: drone.order?.id ?? null,
      createdAt: drone.createdAt,
      updatedAt: drone.updatedAt,
    });
  }

  public async update(payload: DroneEntity): Promise<DroneEntity> {
    const { id, status, batteryLevel } = payload.toObject();

    await this.database
      .update(relations.drones)
      .set({
        status,
        batteryLevel,
      })
      .where(eq(relations.drones.id, id));

    return (await this.findById(id)) as DroneEntity;
  }

  public async getDroneOrderDestination(
    droneId: Drone["id"],
  ): Promise<MapLocation | null> {
    const destinationId = (
      await this.database.query.orders.findFirst({
        where: eq(relations.orders.droneId, droneId),
        columns: {
          destinationId: true,
        },
      })
    )?.destinationId;

    if (!destinationId) {
      return null;
    }

    const destination = await this.database.query.map.findFirst({
      where: eq(relations.map.id, destinationId),
    });

    if (!destination) {
      return null;
    }

    return destination;
  }
}

export { DroneRepository };
