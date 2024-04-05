-- AlterTable
ALTER TABLE "books" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "member" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
