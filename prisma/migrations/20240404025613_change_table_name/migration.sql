/*
  Warnings:

  - You are about to drop the `Books` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MemberBorrowBooks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MemberBorrowBooks" DROP CONSTRAINT "book_id_borrow_fk";

-- DropForeignKey
ALTER TABLE "MemberBorrowBooks" DROP CONSTRAINT "member_id_borrow_fk";

-- DropTable
DROP TABLE "Books";

-- DropTable
DROP TABLE "Member";

-- DropTable
DROP TABLE "MemberBorrowBooks";

-- CreateTable
CREATE TABLE "books" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" TEXT NOT NULL,
    "penalized_end_date" DATE,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_borrow_books" (
    "id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "book_id" UUID NOT NULL,
    "borrowed_at" TIMESTAMP(6) NOT NULL,
    "has_returned" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_borrow_books_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "member_borrow_books" ADD CONSTRAINT "book_id_borrow_fk" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "member_borrow_books" ADD CONSTRAINT "member_id_borrow_fk" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
