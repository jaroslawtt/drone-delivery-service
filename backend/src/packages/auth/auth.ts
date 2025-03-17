import { Provider } from "@nestjs/common";
import { AuthGuard } from "./auth.js";

const authGuardProvider: Provider = {
  useClass: AuthGuard,
  provide: "APP_GUARD",
};

export { authGuardProvider };
export { AuthController } from "./auth.controller.js";
export { AuthModule } from "./auth.module.js";
export { AuthGuard } from "./libs/guards/guards.js";
