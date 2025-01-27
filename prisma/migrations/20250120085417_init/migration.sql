/*
  Warnings:

  - You are about to drop the column `userId` on the `UserVerificationCodes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserVerificationCodes" DROP CONSTRAINT "UserVerificationCodes_userId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ENABLED';

-- AlterTable
ALTER TABLE "StockManager" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ENABLED';

-- AlterTable
ALTER TABLE "UserVerificationCodes" DROP COLUMN "userId";
