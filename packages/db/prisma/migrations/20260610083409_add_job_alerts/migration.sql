-- CreateTable
CREATE TABLE "JobAlert" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "keywords" TEXT[],
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastCheckedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobAlertResult" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "snippet" TEXT,
    "foundAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seenAt" TIMESTAMP(3),

    CONSTRAINT "JobAlertResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobAlert_userId_idx" ON "JobAlert"("userId");

-- CreateIndex
CREATE INDEX "JobAlertResult_alertId_idx" ON "JobAlertResult"("alertId");

-- CreateIndex
CREATE UNIQUE INDEX "JobAlertResult_alertId_url_key" ON "JobAlertResult"("alertId", "url");

-- AddForeignKey
ALTER TABLE "JobAlert" ADD CONSTRAINT "JobAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobAlertResult" ADD CONSTRAINT "JobAlertResult_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "JobAlert"("id") ON DELETE CASCADE ON UPDATE CASCADE;
