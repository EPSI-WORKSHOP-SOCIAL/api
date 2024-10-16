/*
  Warnings:

  - You are about to drop the column `memberCheckId` on the `Check` table. All the data in the column will be lost.
  - You are about to drop the column `nativeCheckId` on the `Check` table. All the data in the column will be lost.
  - You are about to drop the `MemberCheck` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `collectionId` to the `Check` table without a default value. This is not possible if the table is not empty.
  - Added the required column `penNumber` to the `Check` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Check` DROP FOREIGN KEY `Check_memberCheckId_fkey`;

-- DropForeignKey
ALTER TABLE `Check` DROP FOREIGN KEY `Check_nativeCheckId_fkey`;

-- DropForeignKey
ALTER TABLE `MemberCheck` DROP FOREIGN KEY `MemberCheck_collectionId_fkey`;

-- DropForeignKey
ALTER TABLE `MemberCheck` DROP FOREIGN KEY `MemberCheck_memberId_fkey`;

-- AlterTable
ALTER TABLE `Check` DROP COLUMN `memberCheckId`,
    DROP COLUMN `nativeCheckId`,
    ADD COLUMN `collectionId` VARCHAR(191) NOT NULL,
    ADD COLUMN `penNumber` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `MemberCheck`;

-- CreateIndex
CREATE INDEX `Check_collectionId_idx` ON `Check`(`collectionId`);

-- AddForeignKey
ALTER TABLE `Check` ADD CONSTRAINT `Check_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `Collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
