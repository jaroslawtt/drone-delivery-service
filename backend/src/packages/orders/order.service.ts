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
import { DroneService } from "../drones/drone.service.js";
import { DroneStatus } from "../drones/libs/enums/enums.js";

@Injectable()
class OrderService implements Omit<IService, "findAll" | "find"> {
  private readonly orderRepository: OrderRepository;
  private readonly droneService: DroneService;

  public constructor(
    orderRepository: OrderRepository,
    droneService: DroneService,
  ) {
    this.orderRepository = orderRepository;
    this.droneService = droneService;
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

    return orders.map((order) => ({
      ...order.toObject(),
      destination: order.destinationData,
      entryPoint: order.entryPointData,
    }));
  }

  public async create(payload: OrderCreate) {
    const { weight, clientId, destination, entryPoint } = payload;
    const amount = this.calculateAmount({ weight });

    const drones = await this.droneService.find({
      orderId: null,
    });

    if (drones.length === 0) {
      throw new Error("No drones available");
    }

    const droneToDeliverOrder = drones.shift();

    const order = await this.orderRepository.create(
      OrderEntity.initializeNew({
        weight,
        clientId,
        amount,
        status: OrderStatus.CREATED,
        droneId: droneToDeliverOrder!.id,
        destination,
        entryPoint,
      }),
    );

    if (droneToDeliverOrder!.status === DroneStatus.OFFLINE) {
      await this.droneService.update(droneToDeliverOrder!.id, {
        status: DroneStatus.ONLINE,
        batteryLevel: droneToDeliverOrder!.batteryLevel,
        serialNumber: droneToDeliverOrder!.serialNumber,
      });
    }

    return {
      ...order.toObject(),
      destination: order.destinationData,
      entryPoint: order.entryPointData,
    };
  }

  public async update(orderId: Order["id"], payload: OrderUpdate) {
    const { amount, clientId, status, weight, droneId } = payload;

    const order = await this.orderRepository.update(
      OrderEntity.initialize({
        id: orderId,
        amount,
        clientId,
        status,
        weight,
        droneId,
        destination: null,
        entryPoint: null,
        createdAt: null,
        updatedAt: null,
      }),
    );

    return order.toObject();
  }

  public async findByDroneId(droneId: Order["droneId"]) {
    const order = await this.orderRepository.findByDroneId(droneId);

    if (!order) {
      return null;
    }

    return {
      ...order.toObject(),
      destination: order.destinationData,
      entryPoint: order.entryPointData,
    };
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
