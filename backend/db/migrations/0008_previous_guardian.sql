CREATE TABLE "map" (
	"id" serial PRIMARY KEY NOT NULL,
	"latitude" numeric(10, 8) NOT NULL,
	"longitude" numeric(11, 8) NOT NULL,
	"altitude" numeric(7, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "drones_locations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "drones_locations" CASCADE;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "destination_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "entry_point_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_destination_id_map_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."map"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_entry_point_id_map_id_fk" FOREIGN KEY ("entry_point_id") REFERENCES "public"."map"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_drone_id_unique" UNIQUE("drone_id");