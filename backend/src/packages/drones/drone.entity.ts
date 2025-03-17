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

  private readonly "latitude": string | null;

  private readonly "longitude": string | null;

  private readonly "altitude": string | null;

  private readonly "speed": string | null;

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
    latitude,
    longitude,
    altitude,
    speed,
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
    latitude: string | null;
    longitude: string | null;
    altitude: string | null;
    speed: string | null;
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
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
    this.speed = speed;
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
    latitude,
    longitude,
    altitude,
    speed,
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
    latitude: string | null;
    longitude: string | null;
    altitude: string | null;
    speed: string | null;
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
      latitude,
      longitude,
      altitude,
      speed,
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
    latitude = null,
    longitude = null,
    altitude = null,
    speed = null,
  }: {
    serialNumber: string;
    status?: ValueOf<typeof DroneStatus>;
    model: string;
    maxSpeed: string;
    maxAltitude: string;
    batteryCapacity: string;
    weightCapacity: string;
    latitude?: string | null;
    longitude?: string | null;
    altitude?: string | null;
    speed?: string | null;
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
      latitude,
      longitude,
      altitude,
      speed,
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
    latitude: string | null;
    longitude: string | null;
    altitude: string | null;
    speed: string | null;
  } {
    return {
      serialNumber: this.serialNumber as string,
      status: this.status as ValueOf<typeof DroneStatus>,
      model: this.model as string,
      maxSpeed: this.maxSpeed as string,
      maxAltitude: this.maxAltitude as string,
      batteryCapacity: this.batteryCapacity as string,
      weightCapacity: this.weightCapacity as string,
      latitude: this.latitude,
      longitude: this.longitude,
      altitude: this.altitude,
      speed: this.speed,
    };
  }

  public toObject() {
    return {
      id: this.id as number,
      status: this.status as ValueOf<typeof DroneStatus>,
      serialNumber: this.serialNumber as string,
      model: this.model as string,
      createdAt: this.createdAt as Date,
      updatedAt: this.updatedAt as Date,
    };
  }

  public get locationData() {
    return {
      latitude: this.latitude as string,
      longitude: this.longitude as string,
      altitude: this.altitude as string,
      speed: this.speed as string,
    };
  }
}

export { DroneEntity };
