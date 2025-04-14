CREATE TYPE "public"."drone_status" AS ENUM('offline', 'online');--> statement-breakpoint
CREATE TABLE "drones" (
	"id" serial PRIMARY KEY NOT NULL,
	"serial_number" varchar(155) NOT NULL,
	"status" "drone_status" DEFAULT 'offline' NOT NULL,
	"battery_level" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "drones_serial_number_unique" UNIQUE("serial_number")
);
--> statement-breakpoint
CREATE TABLE "drone_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"drone_id" integer NOT NULL,
	"model" varchar(100),
	"max_speed" numeric(5, 2),
	"max_altitude" numeric(7, 2),
	"battery_capacity" numeric(5, 2),
	"weight_capacity" numeric(8, 3),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "drone_details_drone_id_unique" UNIQUE("drone_id")
);
--> statement-breakpoint
CREATE TABLE "drones_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"drone_id" integer NOT NULL,
	"latitude" numeric(10, 8) NOT NULL,
	"longitude" numeric(11, 8) NOT NULL,
	"altitude" numeric(7, 2),
	"speed" numeric(5, 2),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "drones_locations_drone_id_unique" UNIQUE("drone_id")
);
--> statement-breakpoint
ALTER TABLE "user_details" DROP CONSTRAINT "user_details_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "drone_id" integer;--> statement-breakpoint
ALTER TABLE "drone_details" ADD CONSTRAINT "drone_details_drone_id_drones_id_fk" FOREIGN KEY ("drone_id") REFERENCES "public"."drones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drones_locations" ADD CONSTRAINT "drones_locations_drone_id_drones_id_fk" FOREIGN KEY ("drone_id") REFERENCES "public"."drones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_details" ADD CONSTRAINT "user_details_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_drone_id_drones_id_fk" FOREIGN KEY ("drone_id") REFERENCES "public"."drones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_details" ADD CONSTRAINT "user_details_user_id_unique" UNIQUE("user_id");