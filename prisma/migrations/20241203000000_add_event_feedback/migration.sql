-- CreateTable
CREATE TABLE "event_feedbacks" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_feedbacks_pkey" PRIMARY KEY ("id")
);

