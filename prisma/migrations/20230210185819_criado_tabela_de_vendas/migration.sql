-- CreateTable
CREATE TABLE "Vendas" (
    "idVen" TEXT NOT NULL PRIMARY KEY,
    "codigoVen" TEXT NOT NULL,
    "dataVen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valorVenda" REAL NOT NULL,
    "valorDesconto" REAL NOT NULL,
    "valorAcrescimo" REAL NOT NULL,
    "tipoPagto" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendas_codigoVen_key" ON "Vendas"("codigoVen");
