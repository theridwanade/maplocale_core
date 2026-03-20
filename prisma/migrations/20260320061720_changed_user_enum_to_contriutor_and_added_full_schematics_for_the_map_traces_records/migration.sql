/*
  Warnings:

  - The values [USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "MappingMode" AS ENUM ('WALKING', 'CYCLING', 'DRIVING');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('PENDING', 'APPROVED', 'FLAGGED');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'CONTRIBUTOR');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CONTRIBUTOR';
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "role" SET DEFAULT 'CONTRIBUTOR';

-- CreateTable
CREATE TABLE "MappingSession" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "geometry" geometry(LineString, 4326),
    "raw_gps_trace" JSONB NOT NULL,
    "mapping_mode" "MappingMode" NOT NULL,
    "interval_seconds" DOUBLE PRECISION NOT NULL,
    "total_points" INTEGER NOT NULL,
    "browser" TEXT,
    "user_agent" TEXT,
    "platform" TEXT,
    "browser_gps_settings" JSONB,
    "country" TEXT NOT NULL DEFAULT 'Nigeria',
    "state" TEXT,
    "lga" TEXT,
    "town" TEXT,
    "area" TEXT,
    "street_name" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'PENDING',
    "flag_reason" TEXT,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MappingSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MappingSession_user_id_idx" ON "MappingSession"("user_id");

-- CreateIndex
CREATE INDEX "MappingSession_status_idx" ON "MappingSession"("status");

-- CreateIndex
CREATE INDEX "MappingSession_state_lga_idx" ON "MappingSession"("state", "lga");

-- CreateIndex
CREATE INDEX "MappingSession_street_name_idx" ON "MappingSession"("street_name");

-- AddForeignKey
ALTER TABLE "MappingSession" ADD CONSTRAINT "MappingSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MappingSession" ADD CONSTRAINT "MappingSession_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
