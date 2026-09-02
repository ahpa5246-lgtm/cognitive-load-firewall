-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "displayName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CognitiveProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "source" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "reading" INTEGER NOT NULL,
    "memory" INTEGER NOT NULL,
    "attention" INTEGER NOT NULL,
    "visual" INTEGER NOT NULL,
    "motion" INTEGER NOT NULL,
    "density" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CognitiveProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentArtifact" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT,
    "inputType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentAnalysis" (
    "id" TEXT NOT NULL,
    "artifactId" TEXT NOT NULL,
    "reading" INTEGER NOT NULL,
    "memory" INTEGER NOT NULL,
    "attention" INTEGER NOT NULL,
    "visual" INTEGER NOT NULL,
    "motion" INTEGER NOT NULL,
    "density" INTEGER NOT NULL,
    "explanation" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adaptation" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "artifactId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "adaptedContent" TEXT NOT NULL,
    "plan" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Adaptation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdaptationStage" (
    "id" TEXT NOT NULL,
    "adaptationId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "durationMs" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdaptationStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdaptationFeedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "adaptationId" TEXT NOT NULL,
    "ease" TEXT NOT NULL,
    "difficulty" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdaptationFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "category" TEXT NOT NULL,
    "blockedFlow" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SafetyEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicianConstraint" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'user_entered',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicianConstraint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIExecution" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "durationMs" INTEGER,
    "requestHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIReceipt" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "adaptationId" TEXT NOT NULL,
    "rulesTriggered" JSONB NOT NULL,
    "aiStagesUsed" JSONB NOT NULL,
    "preservedCritical" JSONB NOT NULL,
    "safetyChecksPassed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccommodationCard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "needs" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccommodationCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserConsent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserConsent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "CognitiveProfile_userId_createdAt_idx" ON "CognitiveProfile"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ContentArtifact_userId_createdAt_idx" ON "ContentArtifact"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ContentAnalysis_artifactId_key" ON "ContentAnalysis"("artifactId");

-- CreateIndex
CREATE INDEX "Adaptation_userId_createdAt_idx" ON "Adaptation"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Adaptation_artifactId_idx" ON "Adaptation"("artifactId");

-- CreateIndex
CREATE INDEX "AdaptationStage_adaptationId_createdAt_idx" ON "AdaptationStage"("adaptationId", "createdAt");

-- CreateIndex
CREATE INDEX "AdaptationFeedback_adaptationId_createdAt_idx" ON "AdaptationFeedback"("adaptationId", "createdAt");

-- CreateIndex
CREATE INDEX "SafetyEvent_userId_createdAt_idx" ON "SafetyEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ClinicianConstraint_userId_createdAt_idx" ON "ClinicianConstraint"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AIExecution_createdAt_idx" ON "AIExecution"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AIReceipt_adaptationId_key" ON "AIReceipt"("adaptationId");

-- CreateIndex
CREATE UNIQUE INDEX "AccommodationCard_token_key" ON "AccommodationCard"("token");

-- CreateIndex
CREATE INDEX "AccommodationCard_userId_expiresAt_idx" ON "AccommodationCard"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "UserConsent_userId_createdAt_idx" ON "UserConsent"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "CognitiveProfile" ADD CONSTRAINT "CognitiveProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentArtifact" ADD CONSTRAINT "ContentArtifact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentAnalysis" ADD CONSTRAINT "ContentAnalysis_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "ContentArtifact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adaptation" ADD CONSTRAINT "Adaptation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adaptation" ADD CONSTRAINT "Adaptation_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "ContentArtifact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdaptationStage" ADD CONSTRAINT "AdaptationStage_adaptationId_fkey" FOREIGN KEY ("adaptationId") REFERENCES "Adaptation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdaptationFeedback" ADD CONSTRAINT "AdaptationFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdaptationFeedback" ADD CONSTRAINT "AdaptationFeedback_adaptationId_fkey" FOREIGN KEY ("adaptationId") REFERENCES "Adaptation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SafetyEvent" ADD CONSTRAINT "SafetyEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicianConstraint" ADD CONSTRAINT "ClinicianConstraint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIReceipt" ADD CONSTRAINT "AIReceipt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIReceipt" ADD CONSTRAINT "AIReceipt_adaptationId_fkey" FOREIGN KEY ("adaptationId") REFERENCES "Adaptation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccommodationCard" ADD CONSTRAINT "AccommodationCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserConsent" ADD CONSTRAINT "UserConsent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

