/*
  Warnings:

  - You are about to drop the `Vendas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Vendas";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "vendas" (
    "idVen" TEXT NOT NULL PRIMARY KEY,
    "dataVen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codVen" INTEGER NOT NULL,
    "valorVendaLiquido" REAL NOT NULL,
    "valorVendaBruto" REAL NOT NULL,
    "valorDesconto" REAL NOT NULL,
    "valorAcrescimo" REAL NOT NULL,
    "qtdeTotalUnitaria" INTEGER NOT NULL,
    "qtdeTotalCaixa" INTEGER NOT NULL,
    "percDescVenda" REAL NOT NULL,
    "percAcrescVenda" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "itensVenda" (
    "codVen" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codigoItem" TEXT NOT NULL,
    "descricaoItem" TEXT NOT NULL,
    "dataVen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

-- CreateTable
CREATE TABLE "usuarios" (
    "idUsuario" TEXT NOT NULL PRIMARY KEY,
    "login" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "produtos" (
    "codigoProduto" TEXT NOT NULL PRIMARY KEY,
    "descricaoProduto" TEXT NOT NULL,
    "precoUnitProduto" REAL NOT NULL,
    "precoCaixaProduto" REAL NOT NULL,
    "custoProduto" REAL NOT NULL,
    "qtdeUnitaria" INTEGER NOT NULL,
    "qtdeCaixa" INTEGER NOT NULL,
    "barraUnitariaProduto" TEXT NOT NULL,
    "barraCaixaProduto" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "estoqueprodutos" (
    "codigoProduto" TEXT NOT NULL PRIMARY KEY,
    "descricaoProduto" TEXT NOT NULL,
    "qtdeEstoqueUnitaria" INTEGER NOT NULL,
    "qtdeEstoqueCaixa" INTEGER NOT NULL,
    "barraUnitaria" TEXT NOT NULL,
    "barraCaixa" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "movimentacaoprodutos" (
    "idMov" TEXT NOT NULL PRIMARY KEY,
    "codigoProduto" TEXT NOT NULL,
    "descricaoProduto" TEXT NOT NULL,
    "tipoMov" TEXT NOT NULL,
    "precoUnitarioItem" REAL NOT NULL,
    "precoCaixaItem" REAL NOT NULL,
    "barraUnitariaProd" TEXT NOT NULL,
    "barraCaixaProd" TEXT NOT NULL,
    "qtdeUnitariaItem" INTEGER NOT NULL,
    "qtdeCaixaItem" INTEGER NOT NULL,
    "dataMov" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valorTotItem" REAL NOT NULL,
    "descontoPercUnitItem" REAL NOT NULL,
    "descontoValorUnitItem" REAL NOT NULL,
    "acrescimoPercUnitItem" REAL NOT NULL,
    "acrescimoValorUnitItem" REAL NOT NULL,
    "descontoPercCaixaItem" REAL NOT NULL,
    "descontoValorCaixaItem" REAL NOT NULL,
    "acrescimoPercCaixaItem" REAL NOT NULL,
    "acrescimoValorCaixaItem" REAL NOT NULL,
    "valorComDescDaVenda" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "vendas_codVen_key" ON "vendas"("codVen");

-- CreateIndex
CREATE UNIQUE INDEX "itensVenda_codVen_key" ON "itensVenda"("codVen");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_idUsuario_key" ON "usuarios"("idUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_login_key" ON "usuarios"("login");

-- CreateIndex
CREATE UNIQUE INDEX "produtos_codigoProduto_key" ON "produtos"("codigoProduto");

-- CreateIndex
CREATE UNIQUE INDEX "produtos_barraUnitariaProduto_key" ON "produtos"("barraUnitariaProduto");

-- CreateIndex
CREATE UNIQUE INDEX "produtos_barraCaixaProduto_key" ON "produtos"("barraCaixaProduto");

-- CreateIndex
CREATE UNIQUE INDEX "estoqueprodutos_codigoProduto_key" ON "estoqueprodutos"("codigoProduto");

-- CreateIndex
CREATE UNIQUE INDEX "estoqueprodutos_barraUnitaria_key" ON "estoqueprodutos"("barraUnitaria");

-- CreateIndex
CREATE UNIQUE INDEX "estoqueprodutos_barraCaixa_key" ON "estoqueprodutos"("barraCaixa");

-- CreateIndex
CREATE UNIQUE INDEX "movimentacaoprodutos_idMov_key" ON "movimentacaoprodutos"("idMov");
