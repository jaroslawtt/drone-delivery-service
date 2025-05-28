import { DroneStatus } from "./libs/enums/enums.js";
import { IEntity } from "~/libs/interfaces/entity.interface.js";
import { ValueOf } from "~/libs/types/types.js";

class DroneEntity implements IEntity {
  private readonly "id": number | null;

  private readonly "serialNumber": string | null;

  private readonly "status": ValueOf<typeof DroneStatus> | null;

  private readonly "model": string | null;

  private readonly "maxSpeed": string | null;

  private readonly "maxAltitude": string | null;

  private readonly "batteryCapacity": string | null;

  private readonly "weightCapacity": string | null;

  private readonly "batteryLevel": number | null;

  private readonly "orderId": number | null;

  private readonly "createdAt": Date | null;

  private readonly "updatedAt": Date | null;

  private constructor({
    id,
    serialNumber,
    status,
    model,
    maxSpeed,
    maxAltitude,
    batteryCapacity,
    weightCapacity,
    batteryLevel,
    orderId,
    createdAt,
    updatedAt,
  }: {
    id: number | null;
    serialNumber: string | null;
    status: ValueOf<typeof DroneStatus> | null;
    model: string | null;
    maxSpeed: string | null;
    maxAltitude: string | null;
    batteryCapacity: string | null;
    weightCapacity: string | null;
    batteryLevel: number | null;
    orderId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  }) {
    this.id = id;
    this.serialNumber = serialNumber;
    this.status = status;
    this.model = model;
    this.maxSpeed = maxSpeed;
    this.maxAltitude = maxAltitude;
    this.batteryCapacity = batteryCapacity;
    this.weightCapacity = weightCapacity;
    this.batteryLevel = batteryLevel;
    this.orderId = orderId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static initialize({
    id,
    serialNumber,
    status,
    model,
    maxSpeed,
    maxAltitude,
    batteryCapacity,
    weightCapacity,
    batteryLevel,
    orderId,
    createdAt,
    updatedAt,
  }: {
    id: number | null;
    serialNumber: string | null;
    status: ValueOf<typeof DroneStatus> | null;
    model: string | null;
    maxSpeed: string | null;
    maxAltitude: string | null;
    batteryCapacity: string | null;
    weightCapacity: string | null;
    batteryLevel: number | null;
    orderId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  }): DroneEntity {
    return new DroneEntity({
      id,
      serialNumber,
      status,
      model,
      maxSpeed,
      maxAltitude,
      batteryCapacity,
      weightCapacity,
      batteryLevel,
      orderId,
      createdAt,
      updatedAt,
    });
  }

  public static initializeNew({
    serialNumber,
    status = DroneStatus.OFFLINE,
    model,
    maxSpeed,
    maxAltitude,
    batteryCapacity,
    weightCapacity,
    batteryLevel = 100,
    orderId = null,
  }: {
    serialNumber: string;
    status?: ValueOf<typeof DroneStatus>;
    model: string;
    maxSpeed: string;
    maxAltitude: string;
    batteryCapacity: string;
    weightCapacity: string;
    batteryLevel?: number;
    orderId?: number | null;
  }): DroneEntity {
    return new DroneEntity({
      id: null,
      serialNumber,
      status,
      model,
      maxSpeed,
      maxAltitude,
      batteryCapacity,
      weightCapacity,
      batteryLevel,
      orderId,
      createdAt: null,
      updatedAt: null,
    });
  }

  public get details() {
    return {
      model: this.model as string,
      maxSpeed: this.maxSpeed as string,
      maxAltitude: this.maxAltitude as string,
      batteryCapacity: this.batteryCapacity as string,
      weightCapacity: this.weightCapacity as string,
    };
  }

  public toNewObject(): {
    serialNumber: string;
    status: ValueOf<typeof DroneStatus>;
    model: string;
    maxSpeed: string;
    maxAltitude: string;
    batteryCapacity: string;
    weightCapacity: string;
    batteryLevel: number;
  } {
    return {
      serialNumber: this.serialNumber as string,
      status: this.status as ValueOf<typeof DroneStatus>,
      model: this.model as string,
      maxSpeed: this.maxSpeed as string,
      maxAltitude: this.maxAltitude as string,
      batteryCapacity: this.batteryCapacity as string,
      weightCapacity: this.weightCapacity as string,
      batteryLevel: this.batteryLevel as number,
    };
  }

  public toObject() {
    return {
      id: this.id as number,
      status: this.status as ValueOf<typeof DroneStatus>,
      serialNumber: this.serialNumber as string,
      batteryLevel: this.batteryLevel as number,
      model: this.model as string,
      orderId: this.orderId as number | null,
      createdAt: this.createdAt as Date,
      updatedAt: this.updatedAt as Date,
    };
  }
}

export { DroneEntity };
