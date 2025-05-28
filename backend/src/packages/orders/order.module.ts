import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller.js";
import { OrderRepository } from "./order.repository.js";
import { OrderService } from "./order.service.js";
import { DroneModule } from "../drones/drones.js";

@Module({
  imports: [DroneModule],
  controllers: [OrderController],
  providers: [OrderRepository, OrderService],
  exports: [OrderService],
})
class OrderModule {}

export { OrderModule };
