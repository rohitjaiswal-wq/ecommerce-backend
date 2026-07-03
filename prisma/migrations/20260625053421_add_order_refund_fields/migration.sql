-- AlterTable
ALTER TABLE `Order` ADD COLUMN `refundAmount` DOUBLE NULL,
    ADD COLUMN `refundId` VARCHAR(191) NULL;
