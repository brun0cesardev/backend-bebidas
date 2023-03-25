/*
  Warnings:

  - You are about to drop the column `custoProduto` on the `produtos` table. All the data in the column will be lost.
  - Added the required column `custoCaixaProduto` to the `produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `custoUnitProduto` to the `produtos` table without a default value. This is not possible if the table is not empty.

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
    "barraCaixaProduto" TEXT NOT NULL
);
INSERT INTO "new_produtos" ("barraCaixaProduto", "barraUnitariaProduto", "codigoProduto", "descricaoProduto", "precoCaixaProduto", "precoUnitProduto", "qtdeCaixa", "qtdeUnitaria") SELECT "barraCaixaProduto", "barraUnitariaProduto", "codigoProduto", "descricaoProduto", "precoCaixaProduto", "precoUnitProduto", "qtdeCaixa", "qtdeUnitaria" FROM "produtos";
DROP TABLE "produtos";
ALTER TABLE "new_produtos" RENAME TO "produtos";
CREATE UNIQUE INDEX "produtos_codigoProduto_key" ON "produtos"("codigoProduto");
CREATE UNIQUE INDEX "produtos_barraUnitariaProduto_key" ON "produtos"("barraUnitariaProduto");
CREATE UNIQUE INDEX "produtos_barraCaixaProduto_key" ON "produtos"("barraCaixaProduto");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
