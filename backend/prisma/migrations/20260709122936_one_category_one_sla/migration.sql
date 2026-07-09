/*
  Warnings:

  - A unique constraint covering the columns `[supportCategoryId]` on the table `sla_policies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sla_policies_supportCategoryId_key" ON "sla_policies"("supportCategoryId");
