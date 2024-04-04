/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `books` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "books_code_key" ON "books"("code");
