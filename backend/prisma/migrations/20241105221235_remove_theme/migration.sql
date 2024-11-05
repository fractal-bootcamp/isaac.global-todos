/*
  Warnings:

  - You are about to drop the column `themeId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `Theme` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_themeId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "themeId";

-- DropTable
DROP TABLE "Theme";
