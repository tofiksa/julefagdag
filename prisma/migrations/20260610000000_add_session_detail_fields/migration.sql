-- AlterTable
ALTER TABLE "sessions" ADD COLUMN "longDescription" TEXT,
ADD COLUMN "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
