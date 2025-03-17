import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { PinoLogger } from "nestjs-pino";
import pg from "pg";
import * as relations from "./database.schema.js";

class Database {
  public static readonly databaseProviderKey = "DatabaseAsyncProvider";

  private constructor() {}

  public static getProviders(): Provider[] {
    return [
      {
        provide: Database.databaseProviderKey,
        inject: [ConfigService, PinoLogger],
        useFactory: async (
          configService: ConfigService,
          logger: PinoLogger,
        ) => {
          const connectionString = configService.get<string>("DATABASE_URL");

          if (!connectionString) {
            logger.error("Database connection string is not provided");
            throw new Error("DATABASE_URL is not defined");
          }

          const { Pool } = pg;
          const pool = new Pool({
            connectionString,
          });

          try {
            await pool.connect();

            const db = drizzle(pool, { schema: relations }) as NodePgDatabase<
              typeof relations
            >;

            pool.on("error", (err) => {
              logger.error({ err }, "Unexpected error on idle database client");
            });

            logger.info("Database connection established successfully.");

            return db;
          } catch (error) {
            logger.error({ error }, "Failed to establish database connection");

            throw error;
          }
        },
      },
    ];
  }
}

export { Database };
