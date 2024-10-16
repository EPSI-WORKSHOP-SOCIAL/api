/*
  Warnings:

  - You are about to drop the column `email` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Collection` ADD COLUMN `hasNoNativeChecks` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Member` DROP COLUMN `email`,
    DROP COLUMN `imageUrl`,
    DROP COLUMN `name`;
