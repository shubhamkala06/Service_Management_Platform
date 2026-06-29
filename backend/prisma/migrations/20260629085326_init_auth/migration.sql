/*
  Warnings:

  - You are about to drop the column `designation` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "designation",
DROP COLUMN "isActive";
