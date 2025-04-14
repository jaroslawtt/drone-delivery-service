import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller.js";
import { OrderRepository } from "./order.repository.js";
import { OrderService } from "./order.service.js";

@Module({
  controllers: [OrderController],
  providers: [OrderRepository, OrderService],
})
class OrderModule {}

export { OrderModule };
