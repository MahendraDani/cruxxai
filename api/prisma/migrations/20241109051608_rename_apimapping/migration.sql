/*
  Warnings:

  - You are about to drop the `api_mapping` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "api_mapping" DROP CONSTRAINT "api_mapping_userId_fkey";

-- DropTable
DROP TABLE "api_mapping";

-- CreateTable
CREATE TABLE "tokens" (
    "userId" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "tokens_apiKey_key" ON "tokens"("apiKey");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
