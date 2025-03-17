CREATE TABLE "user_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "name" TO "password_hash";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "user_details" ADD CONSTRAINT "user_details_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;