import { OrderStatus } from "./libs/enums/enums.js";
import { IEntity } from "~/libs/interfaces/entity.interface";
import { type ValueOf } from "~/libs/types/types.js";
import { type MapLocation } from "../map/libs/types/types.js";

class OrderEntity implements IEntity {
  private readonly "id": number | null;

  private readonly "clientId": number;

  private readonly "weight": string;

  private readonly "amount": string;

  private readonly "status": ValueOf<typeof OrderStatus>;

  private readonly "droneId": number | null;

  private readonly "destination": MapLocation | null;

  private readonly "entryPoint": MapLocation | null;

  private readonly "createdAt": string | null;

  private readonly "updatedAt": string | null;

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
    entryPoint: MapLocation | null;
    destination: MapLocation | null;
    createdAt: string | null;
    updatedAt: string | null;
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
    entryPoint: MapLocation | null;
    destination: MapLocation | null;
    droneId: number | null;
    createdAt: string | null;
    updatedAt: string | null;
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
    entryPoint: MapLocation;
    destination: MapLocation;
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
      createdAt: this.createdAt as string,
      updatedAt: this.updatedAt as string,
    };
  }

  public get destinationData() {
    return this.destination as MapLocation;
  }

  public get entryPointData() {
    return this.entryPoint as MapLocation;
  }
}

export { OrderEntity };
