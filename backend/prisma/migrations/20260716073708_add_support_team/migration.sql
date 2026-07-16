/*
  Warnings:

  - Added the required column `supportTeamId` to the `support_categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "support_categories" ADD COLUMN     "supportTeamId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "supportTeamId" INTEGER;

-- CreateTable
CREATE TABLE "support_teams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_teams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "support_teams_name_key" ON "support_teams"("name");

-- CreateIndex
CREATE INDEX "users_supportTeamId_idx" ON "users"("supportTeamId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_supportTeamId_fkey" FOREIGN KEY ("supportTeamId") REFERENCES "support_teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_categories" ADD CONSTRAINT "support_categories_supportTeamId_fkey" FOREIGN KEY ("supportTeamId") REFERENCES "support_teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
