/*
  Warnings:

  - You are about to drop the `StockManager` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_StockToStockManager` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdBy` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockOwnerId` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StockManager" DROP CONSTRAINT "StockManager_stockOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "_StockToStockManager" DROP CONSTRAINT "_StockToStockManager_A_fkey";

-- DropForeignKey
ALTER TABLE "_StockToStockManager" DROP CONSTRAINT "_StockToStockManager_B_fkey";

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "stockOwnerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "stockOwnerId" TEXT;

-- DropTable
DROP TABLE "StockManager";

-- DropTable
DROP TABLE "_StockToStockManager";

-- CreateTable
CREATE TABLE "_StockManagers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StockManagers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_StockManagers_B_index" ON "_StockManagers"("B");

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_stockOwnerId_fkey" FOREIGN KEY ("stockOwnerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockManagers" ADD CONSTRAINT "_StockManagers_A_fkey" FOREIGN KEY ("A") REFERENCES "Stock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StockManagers" ADD CONSTRAINT "_StockManagers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
