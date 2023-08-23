-- CreateTable
CREATE TABLE `vendas` (
    `idVen` VARCHAR(191) NOT NULL,
    `dataVen` VARCHAR(191) NOT NULL,
    `codVen` INTEGER NOT NULL,
    `valorVendaLiquido` DOUBLE NOT NULL,
    `valorVendaBruto` DOUBLE NOT NULL,
    `valorDesconto` DOUBLE NOT NULL,
    `valorAcrescimo` DOUBLE NOT NULL,
    `qtdeTotalUnitaria` INTEGER NOT NULL,
    `qtdeTotalCaixa` INTEGER NOT NULL,
    `percDescVenda` DOUBLE NOT NULL,
    `percAcrescVenda` DOUBLE NOT NULL,

    UNIQUE INDEX `vendas_codVen_key`(`codVen`),
    PRIMARY KEY (`idVen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itensVenda` (
    `idMovVen` VARCHAR(191) NOT NULL,
    `codVen` INTEGER NOT NULL,
    `codigoItem` VARCHAR(191) NOT NULL,
    `descricaoItem` VARCHAR(191) NOT NULL,
    `dataVen` VARCHAR(191) NOT NULL,
    `valorItem` DOUBLE NOT NULL,
    `DescontoItem` DOUBLE NOT NULL,
    `AcrescimoItem` DOUBLE NOT NULL,
    `qtdeUnitariaItem` INTEGER NOT NULL,
    `qtdeCaixaItem` INTEGER NOT NULL,
    `precoUnitarioItem` DOUBLE NOT NULL,
    `precoCaixaItem` DOUBLE NOT NULL,
    `barraUnitariaItem` VARCHAR(191) NOT NULL,
    `barraCaixaItem` VARCHAR(191) NOT NULL,
    `valorItemComDescVenda` DOUBLE NOT NULL,
    `percDescItem` DOUBLE NOT NULL,
    `percAcrescItem` DOUBLE NOT NULL,

    PRIMARY KEY (`idMovVen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `idUsuario` VARCHAR(191) NOT NULL,
    `login` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `usuarios_idUsuario_key`(`idUsuario`),
    UNIQUE INDEX `usuarios_login_key`(`login`),
    PRIMARY KEY (`idUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produtos` (
    `codigoProduto` VARCHAR(191) NOT NULL,
    `descricaoProduto` VARCHAR(191) NOT NULL,
    `precoUnitProduto` DOUBLE NOT NULL,
    `precoCaixaProduto` DOUBLE NOT NULL,
    `custoUnitProduto` DOUBLE NOT NULL,
    `custoCaixaProduto` DOUBLE NOT NULL,
    `qtdeUnitaria` INTEGER NOT NULL,
    `qtdeCaixa` INTEGER NOT NULL,
    `barraUnitariaProduto` VARCHAR(191) NOT NULL,
    `barraCaixaProduto` VARCHAR(191) NOT NULL,
    `usaQtdeCaixa` BOOLEAN NOT NULL,

    UNIQUE INDEX `produtos_codigoProduto_key`(`codigoProduto`),
    PRIMARY KEY (`codigoProduto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estoqueprodutos` (
    `codigoProduto` VARCHAR(191) NOT NULL,
    `descricaoProduto` VARCHAR(191) NOT NULL,
    `qtdeEstoqueUnitaria` INTEGER NOT NULL,
    `qtdeEstoqueCaixa` INTEGER NOT NULL,
    `barraUnitaria` VARCHAR(191) NOT NULL,
    `barraCaixa` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `estoqueprodutos_codigoProduto_key`(`codigoProduto`),
    PRIMARY KEY (`codigoProduto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movimentacaoprodutos` (
    `idMov` VARCHAR(191) NOT NULL,
    `codigoProduto` VARCHAR(191) NOT NULL,
    `descricaoProduto` VARCHAR(191) NOT NULL,
    `tipoMov` VARCHAR(191) NOT NULL,
    `precoUnitarioItem` DOUBLE NOT NULL,
    `precoCaixaItem` DOUBLE NOT NULL,
    `barraUnitariaProd` VARCHAR(191) NOT NULL,
    `barraCaixaProd` VARCHAR(191) NOT NULL,
    `qtdeUnitariaItem` INTEGER NOT NULL,
    `qtdeCaixaItem` INTEGER NOT NULL,
    `dataMov` VARCHAR(191) NOT NULL,
    `valorTotItem` DOUBLE NOT NULL,
    `descontoPercUnitItem` DOUBLE NOT NULL,
    `descontoValorUnitItem` DOUBLE NOT NULL,
    `acrescimoPercUnitItem` DOUBLE NOT NULL,
    `acrescimoValorUnitItem` DOUBLE NOT NULL,
    `descontoPercCaixaItem` DOUBLE NOT NULL,
    `descontoValorCaixaItem` DOUBLE NOT NULL,
    `acrescimoPercCaixaItem` DOUBLE NOT NULL,
    `acrescimoValorCaixaItem` DOUBLE NOT NULL,
    `valorComDescDaVenda` DOUBLE NOT NULL,

    UNIQUE INDEX `movimentacaoprodutos_idMov_key`(`idMov`),
    PRIMARY KEY (`idMov`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
