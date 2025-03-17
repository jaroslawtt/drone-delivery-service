import { OrderStatus } from "./libs/enums/enums.js";
import { IEntity } from "~/libs/interfaces/entity.interface";
import { type ValueOf } from "~/libs/types/types.js";

class OrderEntity implements IEntity {
  private readonly "id": number | null;

  private readonly "clientId": number;

  private readonly "weight": string;

  private readonly "amount": string;

  private readonly "status": ValueOf<typeof OrderStatus>;

  private readonly "createdAt": Date | null;

  private readonly "updatedAt": Date | null;

  private constructor({
    id,
    clientId,
    weight,
    amount,
    status,
    createdAt,
    updatedAt,
  }: {
    id: number | null;
    clientId: number;
    weight: string;
    amount: string;
    status: ValueOf<typeof OrderStatus>;
    createdAt: Date | null;
    updatedAt: Date | null;
  }) {
    this.id = id;
    this.clientId = clientId;
    this.weight = weight;
    this.amount = amount;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static initialize({
    id,
    clientId,
    weight,
    amount,
    status,
    createdAt,
    updatedAt,
  }: {
    id: number | null;
    clientId: number;
    weight: string;
    amount: string;
    status: ValueOf<typeof OrderStatus>;
    createdAt: Date | null;
    updatedAt: Date | null;
  }): OrderEntity {
    return new OrderEntity({
      id,
      clientId,
      weight,
      amount,
      status,
      createdAt,
      updatedAt,
    });
  }

  public static initializeNew({
    clientId,
    weight,
    amount,
    status = OrderStatus.CREATED,
  }: {
    clientId: number;
    weight: string;
    amount: string;
    status?: ValueOf<typeof OrderStatus>;
  }): OrderEntity {
    return new OrderEntity({
      id: null,
      clientId,
      weight,
      amount,
      status,
      createdAt: null,
      updatedAt: null,
    });
  }

  public toNewObject(): {
    clientId: number;
    weight: string;
    amount: string;
    status: ValueOf<typeof OrderStatus>;
  } {
    return {
      clientId: this.clientId,
      weight: this.weight,
      amount: this.amount,
      status: this.status,
    };
  }

  public toObject() {
    return {
      id: this.id as number,
      clientId: this.clientId,
      weight: this.weight,
      amount: this.amount,
      status: this.status,
      createdAt: this.createdAt as Date,
      updatedAt: this.updatedAt as Date,
    };
  }
}

export { OrderEntity };
