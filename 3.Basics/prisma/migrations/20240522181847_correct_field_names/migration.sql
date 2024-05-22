/*
  Warnings:

  - You are about to drop the column `decription` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "decription",
DROP COLUMN "image",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL;
