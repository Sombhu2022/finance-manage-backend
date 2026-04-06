-- These changes were manually applied to bypass PostgreSQL transaction limitations.
-- Leaving them empty/commented so that Drizzle marks the migration as "done" without executing failing statements.

-- ALTER TYPE "user_status" ADD VALUE 'pending';--> statement-breakpoint
-- ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
-- ALTER TABLE "users" ADD COLUMN "otp" varchar(6);--> statement-breakpoint
-- ALTER TABLE "users" ADD COLUMN "otp_expires_at" timestamp;