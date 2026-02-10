/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Envelope` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Envelope" DROP COLUMN "deletedAt",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
