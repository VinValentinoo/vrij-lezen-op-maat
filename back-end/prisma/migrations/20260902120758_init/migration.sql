-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'DOCENT');

-- CreateEnum
CREATE TYPE "LeesStatus" AS ENUM ('NIET_GELEZEN', 'GELEZEN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "wachtwoordHash" TEXT NOT NULL,
    "naam" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taalniveau" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "onderwerp" TEXT NOT NULL,
    "lengte" TEXT NOT NULL,
    "leesdoel" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingListItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "catalogusItemId" TEXT NOT NULL,
    "status" "LeesStatus" NOT NULL DEFAULT 'NIET_GELEZEN',
    "toegevoegdOp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadingListItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentDocentKoppeling" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "docentId" TEXT NOT NULL,

    CONSTRAINT "StudentDocentKoppeling_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingProfile_userId_key" ON "ReadingProfile"("userId");

-- CreateIndex
CREATE INDEX "ReadingListItem_userId_idx" ON "ReadingListItem"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentDocentKoppeling_studentId_docentId_key" ON "StudentDocentKoppeling"("studentId", "docentId");

-- AddForeignKey
ALTER TABLE "ReadingProfile" ADD CONSTRAINT "ReadingProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingListItem" ADD CONSTRAINT "ReadingListItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDocentKoppeling" ADD CONSTRAINT "StudentDocentKoppeling_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDocentKoppeling" ADD CONSTRAINT "StudentDocentKoppeling_docentId_fkey" FOREIGN KEY ("docentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
