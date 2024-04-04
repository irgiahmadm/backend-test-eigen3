/*
  Warnings:

  - You are about to alter the column `name` on the `member` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - Added the required column `password` to the `member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "member" ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(50);
