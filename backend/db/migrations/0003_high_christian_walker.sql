CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"weight" numeric(10, 2) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" "status" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;