-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_vendas" (
    "idVen" TEXT NOT NULL PRIMARY KEY,
    "dataVen" TEXT NOT NULL,
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
INSERT INTO "new_vendas" ("codVen", "dataVen", "idVen", "percAcrescVenda", "percDescVenda", "qtdeTotalCaixa", "qtdeTotalUnitaria", "valorAcrescimo", "valorDesconto", "valorVendaBruto", "valorVendaLiquido") SELECT "codVen", "dataVen", "idVen", "percAcrescVenda", "percDescVenda", "qtdeTotalCaixa", "qtdeTotalUnitaria", "valorAcrescimo", "valorDesconto", "valorVendaBruto", "valorVendaLiquido" FROM "vendas";
DROP TABLE "vendas";
ALTER TABLE "new_vendas" RENAME TO "vendas";
CREATE UNIQUE INDEX "vendas_codVen_key" ON "vendas"("codVen");
CREATE TABLE "new_movimentacaoprodutos" (
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
    "dataMov" TEXT NOT NULL,
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
INSERT INTO "new_movimentacaoprodutos" ("acrescimoPercCaixaItem", "acrescimoPercUnitItem", "acrescimoValorCaixaItem", "acrescimoValorUnitItem", "barraCaixaProd", "barraUnitariaProd", "codigoProduto", "dataMov", "descontoPercCaixaItem", "descontoPercUnitItem", "descontoValorCaixaItem", "descontoValorUnitItem", "descricaoProduto", "idMov", "precoCaixaItem", "precoUnitarioItem", "qtdeCaixaItem", "qtdeUnitariaItem", "tipoMov", "valorComDescDaVenda", "valorTotItem") SELECT "acrescimoPercCaixaItem", "acrescimoPercUnitItem", "acrescimoValorCaixaItem", "acrescimoValorUnitItem", "barraCaixaProd", "barraUnitariaProd", "codigoProduto", "dataMov", "descontoPercCaixaItem", "descontoPercUnitItem", "descontoValorCaixaItem", "descontoValorUnitItem", "descricaoProduto", "idMov", "precoCaixaItem", "precoUnitarioItem", "qtdeCaixaItem", "qtdeUnitariaItem", "tipoMov", "valorComDescDaVenda", "valorTotItem" FROM "movimentacaoprodutos";
DROP TABLE "movimentacaoprodutos";
ALTER TABLE "new_movimentacaoprodutos" RENAME TO "movimentacaoprodutos";
CREATE UNIQUE INDEX "movimentacaoprodutos_idMov_key" ON "movimentacaoprodutos"("idMov");
CREATE TABLE "new_itensVenda" (
    "codVen" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
CREATE UNIQUE INDEX "itensVenda_codVen_key" ON "itensVenda"("codVen");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
