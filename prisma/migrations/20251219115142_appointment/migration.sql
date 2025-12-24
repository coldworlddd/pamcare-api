-- CreateTable
CREATE TABLE `appointments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `appointment_date` DATETIME(3) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
