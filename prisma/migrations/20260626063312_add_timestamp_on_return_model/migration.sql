-- AlterTable
ALTER TABLE `ReturnRequest` ADD COLUMN `approvedAt` DATETIME(3) NULL,
    ADD COLUMN `refundInitiatedAt` DATETIME(3) NULL,
    ADD COLUMN `refundedAt` DATETIME(3) NULL,
    ADD COLUMN `rejectedAt` DATETIME(3) NULL;
