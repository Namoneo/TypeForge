-- AlterTable
ALTER TABLE "challenges" ADD COLUMN "tips" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
