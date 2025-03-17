import { type UserEntityPayload } from "./packages/users/users.js";

declare module "fastify" {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface FastifyRequest {
    user: UserEntityPayload | null;
  }
}
