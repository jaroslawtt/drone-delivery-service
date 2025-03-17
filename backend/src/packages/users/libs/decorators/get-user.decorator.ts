import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { FastifyRequest } from "fastify";

const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as FastifyRequest;

  return request.user;
});

export { GetUser };
