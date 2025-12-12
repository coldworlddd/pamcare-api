/*
  Warnings:

  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `profile_image` VARCHAR(500) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `first_name` VARCHAR(100) NOT NULL,
    MODIFY `last_name` VARCHAR(100) NOT NULL;

-- CreateTable
CREATE TABLE `otp_codes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `code` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `id_UNIQUE`(`id`),
    INDEX `otp_codes_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
