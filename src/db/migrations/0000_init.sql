CREATE TABLE "analytics_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"event_type" text NOT NULL,
	"section_id" integer,
	"section_name" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cv_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" text DEFAULT 'nieuw' NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" text,
	"customer_address" text,
	"customer_house_number" text,
	"customer_postal_code" text,
	"customer_city" text,
	"cv_id" text,
	"template_used" text,
	"cv_data" jsonb,
	"amount" numeric(10, 2) DEFAULT '42.00' NOT NULL,
	"dossier_number" text,
	"stripe_session_id" text,
	"stripe_payment_status" text,
	"payment_link" text,
	"paid_at" timestamp with time zone,
	"confirmation_sent_at" timestamp with time zone,
	"invoice_sent_at" timestamp with time zone,
	"reminder_1_sent_at" timestamp with time zone,
	"reminder_2_sent_at" timestamp with time zone,
	"incasso_sent_at" timestamp with time zone,
	"justus_case_id" text,
	"justus_case_number" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"action_type" text NOT NULL,
	"action_description" text NOT NULL,
	"performed_by" text DEFAULT 'system' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_actions" ADD CONSTRAINT "order_actions_order_id_cv_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."cv_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analytics_events_session_id_idx" ON "analytics_events" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "analytics_events_created_at_idx" ON "analytics_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "cv_orders_customer_email_idx" ON "cv_orders" USING btree ("customer_email");--> statement-breakpoint
CREATE INDEX "cv_orders_status_idx" ON "cv_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "cv_orders_justus_case_id_idx" ON "cv_orders" USING btree ("justus_case_id");--> statement-breakpoint
CREATE INDEX "cv_orders_created_at_idx" ON "cv_orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "order_actions_order_id_idx" ON "order_actions" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_actions_created_at_idx" ON "order_actions" USING btree ("created_at");