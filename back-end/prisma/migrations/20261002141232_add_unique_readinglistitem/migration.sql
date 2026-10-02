/*
  Warnings:

  - A unique constraint covering the columns `[userId,catalogusItemId]` on the table `ReadingListItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ReadingListItem_userId_catalogusItemId_key" ON "ReadingListItem"("userId", "catalogusItemId");
