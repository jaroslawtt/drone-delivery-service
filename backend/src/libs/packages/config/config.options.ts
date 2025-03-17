import { ConfigModuleOptions } from "@nestjs/config";
import { validateConfig } from "./libs/helpers/validate-config.helper.js";

const configOptions: ConfigModuleOptions = {
  validate: validateConfig,
  isGlobal: true,
};

export { configOptions };
