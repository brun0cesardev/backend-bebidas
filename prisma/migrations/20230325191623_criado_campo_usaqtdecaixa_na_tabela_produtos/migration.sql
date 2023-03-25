/*
  Warnings:

  - Added the required column `usaQtdeCaixa` to the `produtos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_produtos" (
    "codigoProduto" TEXT NOT NULL PRIMARY KEY,
    "descricaoProduto" TEXT NOT NULL,
    "precoUnitProduto" REAL NOT NULL,
    "precoCaixaProduto" REAL NOT NULL,
    "custoUnitProduto" REAL NOT NULL,
    "custoCaixaProduto" REAL NOT NULL,
    "qtdeUnitaria" INTEGER NOT NULL,
    "qtdeCaixa" INTEGER NOT NULL,
    "barraUnitariaProduto" TEXT NOT NULL,
    "barraCaixaProduto" TEXT NOT NULL,
    "usaQtdeCaixa" BOOLEAN NOT NULL
);
INSERT INTO "new_produtos" ("barraCaixaProduto", "barraUnitariaProduto", "codigoProduto", "custoCaixaProduto", "custoUnitProduto", "descricaoProduto", "precoCaixaProduto", "precoUnitProduto", "qtdeCaixa", "qtdeUnitaria") SELECT "barraCaixaProduto", "barraUnitariaProduto", "codigoProduto", "custoCaixaProduto", "custoUnitProduto", "descricaoProduto", "precoCaixaProduto", "precoUnitProduto", "qtdeCaixa", "qtdeUnitaria" FROM "produtos";
DROP TABLE "produtos";
ALTER TABLE "new_produtos" RENAME TO "produtos";
CREATE UNIQUE INDEX "produtos_codigoProduto_key" ON "produtos"("codigoProduto");
CREATE UNIQUE INDEX "produtos_barraUnitariaProduto_key" ON "produtos"("barraUnitariaProduto");
CREATE UNIQUE INDEX "produtos_barraCaixaProduto_key" ON "produtos"("barraCaixaProduto");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
