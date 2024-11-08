/*
  Warnings:

  - The values [ACTIVE,COMPLETED] on the enum `EpicStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,IN_PROGRESS,COMPLETED,ARCHIVED] on the enum `TaskStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EpicStatus_new" AS ENUM ('active', 'completed');
ALTER TABLE "Epic" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Epic" ALTER COLUMN "status" TYPE "EpicStatus_new" USING ("status"::text::"EpicStatus_new");
ALTER TYPE "EpicStatus" RENAME TO "EpicStatus_old";
ALTER TYPE "EpicStatus_new" RENAME TO "EpicStatus";
DROP TYPE "EpicStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TaskStatus_new" AS ENUM ('pending', 'in_progress', 'completed', 'archived');
ALTER TABLE "Task" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "status" TYPE "TaskStatus_new" USING ("status"::text::"TaskStatus_new");
ALTER TYPE "TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "TaskStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Epic" ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "createdAt" DROP DEFAULT;
