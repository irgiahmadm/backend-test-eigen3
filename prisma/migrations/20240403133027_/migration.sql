/*
  Warnings:

  - You are about to drop the `books` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `member_borrow_books` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "member_borrow_books" DROP CONSTRAINT "book_id_borrow_fk";

-- DropForeignKey
ALTER TABLE "member_borrow_books" DROP CONSTRAINT "member_id_borrow_fk";

-- DropTable
DROP TABLE "books";

-- DropTable
DROP TABLE "member";

-- DropTable
DROP TABLE "member_borrow_books";

-- CreateTable
CREATE TABLE "Books" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" TEXT NOT NULL,
    "penalized_end_date" DATE,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberBorrowBooks" (
    "id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "book_id" UUID NOT NULL,
    "borrowed_at" TIMESTAMP(6) NOT NULL,
    "has_returned" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberBorrowBooks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemberBorrowBooks" ADD CONSTRAINT "book_id_borrow_fk" FOREIGN KEY ("book_id") REFERENCES "Books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MemberBorrowBooks" ADD CONSTRAINT "member_id_borrow_fk" FOREIGN KEY ("member_id") REFERENCES "Member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
