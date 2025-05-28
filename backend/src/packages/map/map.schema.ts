import { decimal, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

const map = pgTable("map", {
  id: serial("id").primaryKey(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export { map };
