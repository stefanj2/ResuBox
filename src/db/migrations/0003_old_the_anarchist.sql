CREATE TABLE "vacancy_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"vacancy_external_id" text,
	"vacancy_title" text,
	"vacancy_company" text,
	"vacancy_url" text,
	"cover_letter" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vacancy_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"status" text DEFAULT 'incomplete' NOT NULL,
	"trial_end" timestamp with time zone,
	"current_period_end" timestamp with time zone,
	"cancel_at_period_end" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vacancy_subscriptions_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "vacancy_applications" ADD CONSTRAINT "vacancy_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vacancy_subscriptions" ADD CONSTRAINT "vacancy_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "vacancy_applications_user_id_idx" ON "vacancy_applications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "vacancy_subscriptions_user_id_idx" ON "vacancy_subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "vacancy_subscriptions_stripe_customer_id_idx" ON "vacancy_subscriptions" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE INDEX "vacancy_subscriptions_stripe_subscription_id_idx" ON "vacancy_subscriptions" USING btree ("stripe_subscription_id");