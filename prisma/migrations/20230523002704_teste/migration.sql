/*
  Warnings:

  - The primary key for the `itensVenda` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `idMovVen` was added to the `itensVenda` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_itensVenda" (
    "idMovVen" TEXT NOT NULL PRIMARY KEY,
    "codVen" INTEGER NOT NULL,
    "codigoItem" TEXT NOT NULL,
    "descricaoItem" TEXT NOT NULL,
    "dataVen" TEXT NOT NULL,
    "valorItem" REAL NOT NULL,
    "DescontoItem" REAL NOT NULL,
    "AcrescimoItem" REAL NOT NULL,
    "qtdeUnitariaItem" INTEGER NOT NULL,
    "qtdeCaixaItem" INTEGER NOT NULL,
    "precoUnitarioItem" REAL NOT NULL,
    "precoCaixaItem" REAL NOT NULL,
    "barraUnitariaItem" TEXT NOT NULL,
    "barraCaixaItem" TEXT NOT NULL,
    "valorItemComDescVenda" REAL NOT NULL,
    "percDescItem" REAL NOT NULL,
    "percAcrescItem" REAL NOT NULL
);
INSERT INTO "new_itensVenda" ("AcrescimoItem", "DescontoItem", "barraCaixaItem", "barraUnitariaItem", "codVen", "codigoItem", "dataVen", "descricaoItem", "percAcrescItem", "percDescItem", "precoCaixaItem", "precoUnitarioItem", "qtdeCaixaItem", "qtdeUnitariaItem", "valorItem", "valorItemComDescVenda") SELECT "AcrescimoItem", "DescontoItem", "barraCaixaItem", "barraUnitariaItem", "codVen", "codigoItem", "dataVen", "descricaoItem", "percAcrescItem", "percDescItem", "precoCaixaItem", "precoUnitarioItem", "qtdeCaixaItem", "qtdeUnitariaItem", "valorItem", "valorItemComDescVenda" FROM "itensVenda";
DROP TABLE "itensVenda";
ALTER TABLE "new_itensVenda" RENAME TO "itensVenda";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
