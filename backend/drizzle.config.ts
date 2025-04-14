import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./build/src/libs/packages/database/database.schema.js",
  out: "./db/migrations",
  dbCredentials: {
    // eslint-disable-next-line no-undef
    url: `${process.env["DATABASE_URL"]}`,
  },
});
