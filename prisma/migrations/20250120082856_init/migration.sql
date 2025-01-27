/*
  Warnings:

  - The values [STOCK_MANAGER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `managerId` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `stockOwnerId` on the `User` table. All the data in the column will be lost.
  - Added the required column `stockOwnerId` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'STOCK_OWNER');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'STOCK_OWNER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_managerId_fkey";

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "managerId",
ADD COLUMN     "stockOwnerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "stockOwnerId";

-- AlterTable
ALTER TABLE "UserVerificationCodes" ALTER COLUMN "expires_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "StockManager" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "stockOwnerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockManager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StockToStockManager" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StockToStockManager_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "StockManager_email_key" ON "StockManager"("email");

-- CreateIndex
CREATE INDEX "_StockToStockManager_B_index" ON "_StockToStockManager"("B");

-- AddForeignKey
ALTER TABLE "StockManager" ADD CONSTRAINT "StockManager_stockOwnerId_fkey" FOREIGN KEY ("stockOwnerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_stockOwnerId_fkey" FOREIGN KEY ("stockOwnerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockToStockManager" ADD CONSTRAINT "_StockToStockManager_A_fkey" FOREIGN KEY ("A") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockToStockManager" ADD CONSTRAINT "_StockToStockManager_B_fkey" FOREIGN KEY ("B") REFERENCES "StockManager"("id") ON DELETE CASCADE ON UPDATE CASCADE;
