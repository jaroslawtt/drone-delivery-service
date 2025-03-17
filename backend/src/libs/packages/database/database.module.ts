import { Global, Module } from "@nestjs/common";
import { Database } from "./database.package.js";

@Global()
@Module({
  imports: [],
  providers: [...Database.getProviders()],
  exports: [Database.databaseProviderKey],
})
class DatabaseModule {}

export { DatabaseModule };
