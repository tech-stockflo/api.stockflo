/*
  Warnings:

  - Added the required column `phoneNumber` to the `StockManager` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StockManager" ADD COLUMN     "phoneNumber" TEXT NOT NULL;
