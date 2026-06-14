CREATE TABLE "cv_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"status" text DEFAULT 'incomplete' NOT NULL,
	"trial_end" timestamp with time zone,
	"current_period_end" timestamp with time zone,
	"cancel_at_period_end" text,
	"trial_reminder_sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cv_subscriptions_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "cv_subscriptions" ADD CONSTRAINT "cv_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cv_subscriptions_user_id_idx" ON "cv_subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "cv_subscriptions_stripe_customer_id_idx" ON "cv_subscriptions" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE INDEX "cv_subscriptions_stripe_subscription_id_idx" ON "cv_subscriptions" USING btree ("stripe_subscription_id");--> statement-breakpoint
CREATE INDEX "cv_subscriptions_trial_end_idx" ON "cv_subscriptions" USING btree ("trial_end");