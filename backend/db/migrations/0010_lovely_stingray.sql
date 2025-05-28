ALTER TABLE "orders" DROP CONSTRAINT "orders_client_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;