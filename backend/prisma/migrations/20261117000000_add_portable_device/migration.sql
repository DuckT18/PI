-- AlterEnum
ALTER TYPE "DeviceType" ADD VALUE IF NOT EXISTS 'portable';

-- AlterTable
ALTER TABLE "Device" ADD COLUMN IF NOT EXISTS "productCode" TEXT;
ALTER TABLE "Device" ADD COLUMN IF NOT EXISTS "connectionType" TEXT;
