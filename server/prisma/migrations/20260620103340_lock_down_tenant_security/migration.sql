/*
  Warnings:

  - The values [PULL,COMMIT] on the enum `GitEventType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `organizationId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceId,projectKey]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,workspaceId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId,slug]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rawPayload` to the `GitActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `GitRepository` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `provider` on the `GitRepository` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `slug` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrgRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'GUEST');

-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "SprintStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "GitProvider" AS ENUM ('GITHUB', 'GITLAB', 'BITBUCKET');

-- AlterEnum
BEGIN;
CREATE TYPE "GitEventType_new" AS ENUM ('PUSH', 'MERGE', 'PR_OPEN', 'PR_CLOSED', 'PR_MERGED', 'BRANCH_CREATED', 'BRANCH_DELETED', 'TAG_CREATED');
ALTER TABLE "GitActivity" ALTER COLUMN "eventType" TYPE "GitEventType_new" USING ("eventType"::text::"GitEventType_new");
ALTER TYPE "GitEventType" RENAME TO "GitEventType_old";
ALTER TYPE "GitEventType_new" RENAME TO "GitEventType";
DROP TYPE "public"."GitEventType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "TaskStatus" ADD VALUE 'BACKLOG';

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "GitActivity" DROP CONSTRAINT "GitActivity_repositoryId_fkey";

-- DropForeignKey
ALTER TABLE "GitActivity" DROP CONSTRAINT "GitActivity_userId_fkey";

-- DropForeignKey
ALTER TABLE "GitFileChange" DROP CONSTRAINT "GitFileChange_gitActivityId_fkey";

-- DropForeignKey
ALTER TABLE "GitRepository" DROP CONSTRAINT "GitRepository_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_projectId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Workspace" DROP CONSTRAINT "Workspace_organizationId_fkey";

-- AlterTable
ALTER TABLE "GitActivity" ADD COLUMN     "rawPayload" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "GitRepository" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "provider",
ADD COLUMN     "provider" "GitProvider" NOT NULL;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "status" SET DEFAULT 'PLANNING',
ALTER COLUMN "completionPercentage" SET DEFAULT 0,
ALTER COLUMN "completionPercentage" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "parentTaskId" TEXT,
ADD COLUMN     "sprintId" TEXT,
ADD COLUMN     "storyPoints" INTEGER,
ALTER COLUMN "status" SET DEFAULT 'TODO',
ALTER COLUMN "priority" SET DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "organizationId",
DROP COLUMN "role";

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "slug" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "OrgRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceMember" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "WorkspaceRole" NOT NULL DEFAULT 'VIEWER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sprint" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "goal" TEXT,
    "status" "SprintStatus" NOT NULL DEFAULT 'PLANNED',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Label" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskLabel" (
    "taskId" TEXT NOT NULL,
    "labelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskLabel_pkey" PRIMARY KEY ("taskId","labelId")
);

-- CreateIndex
CREATE INDEX "OrganizationMember_organizationId_idx" ON "OrganizationMember"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationMember_userId_idx" ON "OrganizationMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_organizationId_userId_key" ON "OrganizationMember"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "WorkspaceMember_workspaceId_idx" ON "WorkspaceMember"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkspaceMember_workspaceId_userId_key" ON "WorkspaceMember"("workspaceId", "userId");

-- CreateIndex
CREATE INDEX "Sprint_projectId_idx" ON "Sprint"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Sprint_id_projectId_key" ON "Sprint"("id", "projectId");

-- CreateIndex
CREATE INDEX "Label_projectId_idx" ON "Label"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Label_projectId_name_key" ON "Label"("projectId", "name");

-- CreateIndex
CREATE INDEX "Comment_taskId_idx" ON "Comment"("taskId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "GitActivity_repositoryId_idx" ON "GitActivity"("repositoryId");

-- CreateIndex
CREATE INDEX "GitActivity_userId_idx" ON "GitActivity"("userId");

-- CreateIndex
CREATE INDEX "GitActivity_eventTime_idx" ON "GitActivity"("eventTime");

-- CreateIndex
CREATE INDEX "GitFileChange_gitActivityId_filePath_idx" ON "GitFileChange"("gitActivityId", "filePath");

-- CreateIndex
CREATE INDEX "GitRepository_projectId_idx" ON "GitRepository"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "Project_workspaceId_idx" ON "Project"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_workspaceId_projectKey_key" ON "Project"("workspaceId", "projectKey");

-- CreateIndex
CREATE UNIQUE INDEX "Project_id_workspaceId_key" ON "Project"("id", "workspaceId");

-- CreateIndex
CREATE INDEX "Task_projectId_idx" ON "Task"("projectId");

-- CreateIndex
CREATE INDEX "Task_sprintId_idx" ON "Task"("sprintId");

-- CreateIndex
CREATE INDEX "Task_assigneeId_idx" ON "Task"("assigneeId");

-- CreateIndex
CREATE INDEX "Task_parentTaskId_idx" ON "Task"("parentTaskId");

-- CreateIndex
CREATE INDEX "Workspace_organizationId_idx" ON "Workspace"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_organizationId_slug_key" ON "Workspace"("organizationId", "slug");

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspaceMember" ADD CONSTRAINT "WorkspaceMember_organizationId_userId_fkey" FOREIGN KEY ("organizationId", "userId") REFERENCES "OrganizationMember"("organizationId", "userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sprint" ADD CONSTRAINT "Sprint_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_sprintId_projectId_fkey" FOREIGN KEY ("sprintId", "projectId") REFERENCES "Sprint"("id", "projectId") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskLabel" ADD CONSTRAINT "TaskLabel_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskLabel" ADD CONSTRAINT "TaskLabel_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitRepository" ADD CONSTRAINT "GitRepository_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitActivity" ADD CONSTRAINT "GitActivity_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "GitRepository"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitActivity" ADD CONSTRAINT "GitActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitFileChange" ADD CONSTRAINT "GitFileChange_gitActivityId_fkey" FOREIGN KEY ("gitActivityId") REFERENCES "GitActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
