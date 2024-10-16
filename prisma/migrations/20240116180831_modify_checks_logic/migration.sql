/*
  Warnings:

  - You are about to drop the column `collectionId` on the `Check` table. All the data in the column will be lost.
  - You are about to drop the column `penNumber` on the `Check` table. All the data in the column will be lost.
  - Added the required column `memberCheckId` to the `Check` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Check` DROP FOREIGN KEY `Check_collectionId_fkey`;

-- DropForeignKey
ALTER TABLE `Check` DROP FOREIGN KEY `Check_id_fkey`;

-- DropIndex
DROP INDEX `Check_penNumber_idx` ON `Check`;

-- AlterTable
ALTER TABLE `Check` DROP COLUMN `collectionId`,
    DROP COLUMN `penNumber`,
    ADD COLUMN `memberCheckId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `MemberCheck` (
    `id` VARCHAR(191) NOT NULL,
    `penNumber` VARCHAR(191) NOT NULL,
    `collectionId` VARCHAR(191) NOT NULL,
    `memberId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `MemberCheck_collectionId_idx`(`collectionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Check_nativeCheckId_idx` ON `Check`(`nativeCheckId`);

-- AddForeignKey
ALTER TABLE `Check` ADD CONSTRAINT `Check_nativeCheckId_fkey` FOREIGN KEY (`nativeCheckId`) REFERENCES `NativeCheck`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Check` ADD CONSTRAINT `Check_memberCheckId_fkey` FOREIGN KEY (`memberCheckId`) REFERENCES `MemberCheck`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MemberCheck` ADD CONSTRAINT `MemberCheck_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `Collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MemberCheck` ADD CONSTRAINT `MemberCheck_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
