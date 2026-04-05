/*
  Warnings:

  - You are about to drop the column `has_set_password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_verified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PasswordResetToken" ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "has_set_password",
DROP COLUMN "is_verified",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT false;
