import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { GetUser, type UserEntityPayload } from "../users/users.js";
import {
  type OrderGetAllResponseDto,
  type OrderCreateRequestDto,
  type OrderCreateResponseDto,
  type OrderCalculateAmountRequestDto,
  type OrderGetNumberOfOrdersProducedTodayResponse,
} from "./libs/types/types.js";
import {
  orderCalculateAmountValidationSchema,
  orderCreateValidationSchema,
  orderIdPathParamValidationSchema,
} from "./libs/validation-schemas/validation-schemas.js";
import { OrderService } from "./order.service.js";
import { BodyValidationSchema } from "~/libs/packages/validation/body-validation-schema.decorator.js";
import { PathParamsValidationSchema } from "~/libs/packages/validation/path-params-validation-schema.js";
import { OrdersApiPath } from "./libs/enums/enums.js";
@Controller("/orders")
class OrderController {
  private readonly orderService: OrderService;

  public constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  @Post()
  @BodyValidationSchema(orderCreateValidationSchema)
  public async create(
    @Body() orderCreateRequestDto: OrderCreateRequestDto,
    @GetUser() user: UserEntityPayload,
  ): Promise<OrderCreateResponseDto> {
    const { weight, destination, entryPoint } = orderCreateRequestDto;

    const order = await this.orderService.create({
      weight,
      destination,
      entryPoint,
      clientId: user.id,
    });

    return order;
  }

  @Get("/:orderId")
  @PathParamsValidationSchema(orderIdPathParamValidationSchema)
  public async findById(@Param("orderId") orderId: number) {
    return this.orderService.findById(orderId);
  }

  @Get()
  public async findByCleintId(
    @GetUser() user: UserEntityPayload,
  ): Promise<OrderGetAllResponseDto> {
    const orders = await this.orderService.findByClientId(user.id);

    return {
      items: orders,
    };
  }

  @Delete("/:orderId")
  @PathParamsValidationSchema(orderIdPathParamValidationSchema)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param("orderId") orderId: number): Promise<void> {
    return void (await this.orderService.delete(orderId));
  }

  @Post("/amount")
  @BodyValidationSchema(orderCalculateAmountValidationSchema)
  public calculateAmount(
    @Body() orderCalculateAmountRequestDto: OrderCalculateAmountRequestDto,
  ) {
    return this.orderService.calculateAmount(orderCalculateAmountRequestDto);
  }

  @Get(OrdersApiPath.PRODUCED_TODAY)
  public async numberOfProducedOrdersToday(): Promise<OrderGetNumberOfOrdersProducedTodayResponse> {
    const number = await this.orderService.numberOfProducedOrdersToday();

    return {
      value: number,
    };
  }
}

export { OrderController };
