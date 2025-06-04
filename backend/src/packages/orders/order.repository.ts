import { Injectable } from "@nestjs/common";
import { desc, eq, or, and, gte, lt, sql } from "drizzle-orm";
import { type Order } from "./libs/types/types.js";
import { OrderEntity } from "./order.entity.js";
import { IRepository } from "~/libs/interfaces/repository.interface.js";
import { relations } from "~/libs/packages/database/database.js";
import { BaseRepository } from "~/libs/packages/repository/repository.package.js";

@Injectable()
class OrderRepository
  extends BaseRepository
  implements Omit<IRepository, "find">
{
  public async update(payload: OrderEntity): Promise<OrderEntity> {
    const { id, amount, status, weight, droneId } = payload.toObject();

    const [orderReturningColumns] = await this.database
      .update(relations.orders)
      .set({
        amount,
        status,
        weight,
        droneId,
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
      droneId,
      destination: null,
      entryPoint: null,
      createdAt: orderReturningColumns!.createdAt!.toISOString(),
      updatedAt: orderReturningColumns!.updatedAt!.toISOString(),
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
      with: {
        destination: true,
        entryPoint: true,
      },
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
      droneId: order.droneId,
      destination: order.destination,
      entryPoint: order.entryPoint,
      createdAt: order.createdAt!.toISOString(),
      updatedAt: order.updatedAt!.toISOString(),
    });
  }

  public async findByClientId(
    clientId: Order["clientId"],
  ): Promise<OrderEntity[]> {
    const orders = await this.database.query.orders.findMany({
      where: eq(relations.orders.clientId, clientId),
      with: {
        destination: true,
        entryPoint: true,
      },
      orderBy: [desc(relations.orders.createdAt)],
    });

    return orders.map((order) =>
      OrderEntity.initialize({
        id: order.id,
        clientId: order.clientId,
        amount: order.amount,
        status: order.status,
        weight: order.weight,
        destination: order.destination,
        droneId: order.droneId,
        entryPoint: order.entryPoint,
        createdAt: order.createdAt!.toISOString(),
        updatedAt: order.updatedAt!.toISOString(),
      }),
    );
  }

  public async create(payload: OrderEntity): Promise<OrderEntity> {
    const { amount, clientId, status, weight, droneId } = payload.toNewObject();
    const entryPoint = payload.entryPointData;
    const destination = payload.destinationData;

    const [returnedOrderColumns] = await this.database.transaction(
      async (trx) => {
        const [entryPointReturingObj, destinationReturingObj] = await trx
          .insert(relations.map)
          .values([
            {
              latitude: entryPoint.latitude,
              longitude: entryPoint.longitude,
            },
            {
              latitude: destination.latitude,
              longitude: destination.longitude,
            },
          ])
          .returning({
            mapItemId: relations.map.id,
          });

        return await trx
          .insert(relations.orders)
          .values({
            amount,
            clientId,
            status,
            weight,
            droneId,
            entryPointId: entryPointReturingObj!.mapItemId,
            destinationId: destinationReturingObj!.mapItemId,
          })
          .returning({
            orderId: relations.orders.id,
            createdAt: relations.orders.createdAt,
            updatedAt: relations.orders.updatedAt,
          });
      },
    );

    return OrderEntity.initialize({
      id: returnedOrderColumns!.orderId,
      clientId,
      amount,
      status,
      weight,
      droneId,
      destination,
      entryPoint,
      createdAt: returnedOrderColumns!.createdAt!.toISOString(),
      updatedAt: returnedOrderColumns!.updatedAt!.toISOString(),
    });
  }

  public async findAll(): Promise<OrderEntity[]> {
    const orders = await this.database.query.orders.findMany({
      with: {
        destination: true,
        entryPoint: true,
      },
      orderBy: [desc(relations.orders.createdAt)],
    });

    return orders.map((order) =>
      OrderEntity.initialize({
        id: order.id,
        clientId: order.clientId,
        amount: order.amount,
        status: order.status,
        weight: order.weight,
        destination: order.destination,
        droneId: order.droneId,
        entryPoint: order.entryPoint,
        createdAt: order.createdAt!.toISOString(),
        updatedAt: order.updatedAt!.toISOString(),
      }),
    );
  }

  public async producedOrdersToday(): Promise<number> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    const result = await this.database
      .select({ count: sql<number>`count(*)` })
      .from(relations.orders)
      .where(
        and(
          gte(relations.orders.createdAt, today),
          lt(relations.orders.createdAt, tomorrow),
        ),
      );

    return Number(result[0]?.count ?? 0);
  }

  public async findByDroneId(
    droneId: Order["droneId"],
  ): Promise<OrderEntity | null> {
    if (!droneId) {
      return null;
    }

    const order = await this.database.query.orders.findFirst({
      where: eq(relations.orders.droneId, droneId),
      with: {
        destination: true,
        entryPoint: true,
      },
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
      destination: order.destination,
      droneId: order.droneId,
      entryPoint: order.entryPoint,
      createdAt: order.createdAt!.toISOString(),
      updatedAt: order.updatedAt!.toISOString(),
    });
  }
}

export { OrderRepository };
