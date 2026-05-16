ALTER TABLE "cv_orders" ADD COLUMN "locale" text DEFAULT 'nl' NOT NULL;--> statement-breakpoint
ALTER TABLE "cv_orders" ADD COLUMN "reminder_3_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "cv_orders" ADD COLUMN "sms_1_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "cv_orders" ADD COLUMN "sms_2_sent_at" timestamp with time zone;