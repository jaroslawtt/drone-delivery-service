import { Inject } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { relations } from "../database/database.js";

class BaseRepository {
  protected readonly database: NodePgDatabase<typeof relations>;

  public constructor(
    @Inject("DatabaseAsyncProvider")
    database: NodePgDatabase<typeof relations>,
  ) {
    this.database = database;
  }
}

export { BaseRepository };
