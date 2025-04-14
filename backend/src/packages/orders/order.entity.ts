import { OrderStatus } from "./libs/enums/enums.js";
import { IEntity } from "~/libs/interfaces/entity.interface";
import { type ValueOf } from "~/libs/types/types.js";
import { DroneLocation } from "../drones/drones.js";

class OrderEntity implements IEntity {
  private readonly "id": number | null;

  private readonly "clientId": number;

  private readonly "weight": string;

  private readonly "amount": string;

  private readonly "status": ValueOf<typeof OrderStatus>;

  private readonly "droneId": number | null;

  private readonly "destination": DroneLocation | null;

  private readonly "entryPoint": DroneLocation | null;

  private readonly "createdAt": Date | null;

  private readonly "updatedAt": Date | null;

  private constructor({
    id,
    clientId,
    weight,
    amount,
    status,
    destination,
    entryPoint,
    droneId,
    createdAt,
    updatedAt,
  }: {
    id: number | null;
    clientId: number;
    weight: string;
    amount: string;
    status: ValueOf<typeof OrderStatus>;
    droneId: number | null;
    entryPoint: DroneLocation | null;
    destination: DroneLocation | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  }) {
    this.id = id;
    this.clientId = clientId;
    this.weight = weight;
    this.amount = amount;
    this.status = status;
    this.destination = destination;
    this.droneId = droneId;
    this.entryPoint = entryPoint;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static initialize({
    id,
    clientId,
    weight,
    amount,
    status,
    destination,
    entryPoint,
    droneId,
    createdAt,
    updatedAt,
  }: {
    id: number | null;
    clientId: number;
    weight: string;
    amount: string;
    status: ValueOf<typeof OrderStatus>;
    entryPoint: DroneLocation | null;
    destination: DroneLocation | null;
    droneId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  }): OrderEntity {
    return new OrderEntity({
      id,
      clientId,
      weight,
      amount,
      status,
      droneId,
      destination,
      entryPoint,
      createdAt,
      updatedAt,
    });
  }

  public static initializeNew({
    clientId,
    weight,
    amount,
    status = OrderStatus.CREATED,
    droneId = null,
    destination,
    entryPoint,
  }: {
    clientId: number;
    weight: string;
    amount: string;
    status?: ValueOf<typeof OrderStatus>;
    droneId?: number | null;
    entryPoint: DroneLocation;
    destination: DroneLocation;
  }): OrderEntity {
    return new OrderEntity({
      id: null,
      clientId,
      weight,
      amount,
      status,
      destination,
      droneId,
      entryPoint,
      createdAt: null,
      updatedAt: null,
    });
  }

  public toNewObject(): {
    clientId: number;
    weight: string;
    amount: string;
    status: ValueOf<typeof OrderStatus>;
    droneId: number | null;
  } {
    return {
      clientId: this.clientId,
      weight: this.weight,
      amount: this.amount,
      status: this.status,
      droneId: this.droneId,
    };
  }

  public toObject() {
    return {
      id: this.id as number,
      clientId: this.clientId,
      weight: this.weight,
      amount: this.amount,
      status: this.status,
      droneId: this.droneId as number | null,
      createdAt: this.createdAt as Date,
      updatedAt: this.updatedAt as Date,
    };
  }

  public get destinationData() {
    return this.destination as DroneLocation;
  }

  public get entryPointData() {
    return this.entryPoint as DroneLocation;
  }
}

export { OrderEntity };
