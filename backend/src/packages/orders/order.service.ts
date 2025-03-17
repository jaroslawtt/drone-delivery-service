import { Injectable } from "@nestjs/common";
import { OrderStatus } from "./libs/enums/enums.js";
import {
  type OrderCreate,
  type Order,
  type OrderUpdate,
} from "./libs/types/types.js";
import { OrderEntity } from "./order.entity.js";
import { OrderRepository } from "./order.repository.js";
import { IService } from "~/libs/interfaces/interfaces.js";
@Injectable()
class OrderService implements Omit<IService, "findAll" | "find"> {
  private readonly orderRepository: OrderRepository;

  public constructor(orderRepository: OrderRepository) {
    this.orderRepository = orderRepository;
  }

  public async findById(orderId: Order["id"]) {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return null;
    }

    return order.toObject();
  }

  public async findByClientId(clientId: Order["clientId"]) {
    const orders = await this.orderRepository.findByClientId(clientId);

    return orders.map((order) => order.toObject());
  }

  public async create(payload: OrderCreate) {
    const { weight, clientId } = payload;
    const amount = this.calculateAmount({ weight });

    const order = await this.orderRepository.create(
      OrderEntity.initializeNew({
        weight,
        clientId,
        amount,
        status: OrderStatus.CREATED,
      }),
    );

    return order.toObject();
  }

  public async update(orderId: Order["id"], payload: OrderUpdate) {
    const { amount, clientId, status, weight } = payload;

    const order = await this.orderRepository.update(
      OrderEntity.initialize({
        id: orderId,
        amount,
        clientId,
        status,
        weight,
        createdAt: null,
        updatedAt: null,
      }),
    );

    return order.toObject();
  }

  public async delete(orderId: Order["id"]) {
    return void (await this.orderRepository.delete(orderId));
  }

  public calculateAmount(payload: Pick<Order, "weight">): string {
    const { weight } = payload;

    return (parseFloat(weight) * 1.5).toFixed(2);
  }
}

export { OrderService };
