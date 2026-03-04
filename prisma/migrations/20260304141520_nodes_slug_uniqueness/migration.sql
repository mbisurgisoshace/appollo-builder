/*
  Warnings:

  - You are about to drop the column `features` on the `nodes` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `nodes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug,projectId]` on the table `nodes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "nodes_type_slug_projectId_key";

-- AlterTable
ALTER TABLE "nodes" DROP COLUMN "features",
DROP COLUMN "tags";

-- CreateIndex
CREATE UNIQUE INDEX "nodes_slug_projectId_key" ON "nodes"("slug", "projectId");
