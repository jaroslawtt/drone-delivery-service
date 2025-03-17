import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { type Order } from "./libs/types/types.js";
import { OrderEntity } from "./order.entity.js";
import { IRepository } from "~/libs/interfaces/repository.interface.js";
import { relations } from "~/libs/packages/database/database.js";
import { BaseRepository } from "~/libs/packages/repository/repository.package.js";

@Injectable()
class OrderRepository
  extends BaseRepository
  implements Omit<IRepository, "findAll" | "find">
{
  public async update(payload: OrderEntity): Promise<OrderEntity> {
    const { id, amount, status, weight } = payload.toObject();

    const [orderReturningColumns] = await this.database
      .update(relations.orders)
      .set({
        amount,
        status,
        weight,
      })
      .where(eq(relations.orders.id, id))
      .returning({
        clientId: relations.orders.clientId,
        createdAt: relations.orders.createdAt,
        updatedAt: relations.orders.updatedAt,
      });

    return OrderEntity.initialize({
      id,
      clientId: orderReturningColumns!.clientId!,
      amount,
      status,
      weight,
      createdAt: orderReturningColumns!.createdAt!,
      updatedAt: orderReturningColumns!.updatedAt,
    });
  }

  public async delete(orderId: Order["id"]): Promise<void> {
    return void (await this.database
      .delete(relations.orders)
      .where(eq(relations.orders.id, orderId)));
  }

  public async findById(orderId: Order["id"]): Promise<OrderEntity | null> {
    const order = await this.database.query.orders.findFirst({
      where: eq(relations.orders.id, orderId),
    });

    if (!order) {
      return null;
    }

    return OrderEntity.initialize({
      id: order.id,
      clientId: order.clientId,
      amount: order.amount,
      status: order.status,
      weight: order.weight,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  }

  public async findByClientId(
    clientId: Order["clientId"],
  ): Promise<OrderEntity[]> {
    const orders = await this.database.query.orders.findMany({
      where: eq(relations.orders.clientId, clientId),
    });

    return orders.map((order) =>
      OrderEntity.initialize({
        id: order.id,
        clientId: order.clientId,
        amount: order.amount,
        status: order.status,
        weight: order.weight,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      }),
    );
  }

  public async create(payload: OrderEntity): Promise<OrderEntity> {
    const { amount, clientId, status, weight } = payload.toNewObject();

    const [returnedOrderColumns] = await this.database
      .insert(relations.orders)
      .values({
        amount,
        clientId,
        status,
        weight,
      })
      .returning({
        orderId: relations.orders.id,
        createdAt: relations.orders.createdAt,
        updatedAt: relations.orders.updatedAt,
      });

    if (!returnedOrderColumns) {
      throw new Error("Failed to create a new order");
    }

    return OrderEntity.initialize({
      id: returnedOrderColumns.orderId,
      clientId,
      amount,
      status,
      weight,
      createdAt: returnedOrderColumns.createdAt,
      updatedAt: returnedOrderColumns.updatedAt,
    });
  }
}

export { OrderRepository };
