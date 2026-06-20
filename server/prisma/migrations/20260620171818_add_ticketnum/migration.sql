/*
  Warnings:

  - Added the required column `ticketNumber` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "ticketNumber" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "MemberTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberToTag" (
    "organizationMemberId" TEXT NOT NULL,
    "memberTagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberToTag_pkey" PRIMARY KEY ("organizationMemberId","memberTagId")
);

-- CreateIndex
CREATE INDEX "MemberTag_organizationId_idx" ON "MemberTag"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberTag_organizationId_name_key" ON "MemberTag"("organizationId", "name");

-- CreateIndex
CREATE INDEX "Task_projectId_ticketNumber_idx" ON "Task"("projectId", "ticketNumber");

-- AddForeignKey
ALTER TABLE "MemberTag" ADD CONSTRAINT "MemberTag_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberToTag" ADD CONSTRAINT "MemberToTag_organizationMemberId_fkey" FOREIGN KEY ("organizationMemberId") REFERENCES "OrganizationMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberToTag" ADD CONSTRAINT "MemberToTag_memberTagId_fkey" FOREIGN KEY ("memberTagId") REFERENCES "MemberTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
