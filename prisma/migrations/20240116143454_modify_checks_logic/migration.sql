/*
  Warnings:

  - The primary key for the `Check` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `Check` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `nativeCheckId` to the `Check` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collectionId` to the `NativeCheck` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Check` DROP PRIMARY KEY,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD COLUMN `nativeCheckId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `NativeCheck` ADD COLUMN `collectionId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `NativeCheck_collectionId_idx` ON `NativeCheck`(`collectionId`);

-- AddForeignKey
ALTER TABLE `Check` ADD CONSTRAINT `Check_id_fkey` FOREIGN KEY (`id`) REFERENCES `NativeCheck`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NativeCheck` ADD CONSTRAINT `NativeCheck_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `Collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
