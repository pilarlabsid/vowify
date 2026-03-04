-- CreateTable
CREATE TABLE "TemplateMetadata" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "badge" TEXT,
    "category" TEXT,
    "status" TEXT,
    "tier" TEXT,
    "previewImage" TEXT,
    "features" TEXT[],
    "tags" TEXT[],
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "syncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateMetadata_pkey" PRIMARY KEY ("id")
);
