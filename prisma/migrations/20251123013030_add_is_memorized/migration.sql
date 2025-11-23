-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Problem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "problemFile" TEXT NOT NULL,
    "answerFile" TEXT NOT NULL,
    "audioFile" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isMemorized" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Problem" ("answerFile", "audioFile", "createdAt", "id", "order", "problemFile", "title") SELECT "answerFile", "audioFile", "createdAt", "id", "order", "problemFile", "title" FROM "Problem";
DROP TABLE "Problem";
ALTER TABLE "new_Problem" RENAME TO "Problem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
