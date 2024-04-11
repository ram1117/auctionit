-- DropIndex
DROP INDEX "notification_token_notification_token_key";

-- AlterTable
ALTER TABLE "auction" ALTER COLUMN "deadline" SET DEFAULT NOW() + interval '24 hours';
