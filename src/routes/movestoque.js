"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saidaEstoqueRoutes = exports.entradaEstoqueRoutes = void 0;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
async function entradaEstoqueRoutes(fastify) {
    fastify.post('/entradaestoque/consultaproduto', async function (request) {
        const entradaEstoqueBody = zod_1.z.object({
            codigoBarras: zod_1.z.string()
        });
        const { codigoBarras } = entradaEstoqueBody.parse(request.body);
        try {
            const produtoEntrada = await prisma_1.prisma.produtos.findMany({
                where: {
                    OR: [
                        {
                            barraCaixaProduto: codigoBarras
                        },
                        {
                            barraUnitariaProduto: codigoBarras
                        }
                    ]
                }
            });
            return produtoEntrada;
        }
        catch (error) {
            console.error(error.message);
        }
    });
    fastify.post('/entradaestoque/novaentrada', async function (request, reply) {
        try {
            const novaEntradaEstoqueBody = zod_1.z.array(zod_1.z.object({
                codigoProdutoEntrada: zod_1.z.string(),
                descricaoProdutoEntrada: zod_1.z.string(),
                precoUnitarioItemEntrada: zod_1.z.number(),
                precoCaixaItemEntrada: zod_1.z.number(),
                barraCodigoEntrada: zod_1.z.string(),
                qtdeUnitariaEntrada: zod_1.z.number(),
                qtdeCaixaEntrada: zod_1.z.number(),
            }));
            const entradaEstoqueArray = novaEntradaEstoqueBody.parse(request.body);
            const dataHoje = new Date();
            const diaComZero = String(dataHoje.getDate()) == '1' || String(dataHoje.getDate()) == '2' || String(dataHoje.getDate()) == '3' || String(dataHoje.getDate()) == '4' || String(dataHoje.getDate()) == '5' || String(dataHoje.getDate()) == '6' || String(dataHoje.getDate()) == '7' || String(dataHoje.getDate()) == '8' || String(dataHoje.getDate()) == '9' ? ('0' + String(dataHoje.getDate())) : String(dataHoje.getDate());
            const diaHoje = diaComZero;
            const mesComZero = String(dataHoje.getMonth()) == '1' || String(dataHoje.getMonth()) == '2' || String(dataHoje.getMonth()) == '3' || String(dataHoje.getMonth()) == '4' || String(dataHoje.getMonth()) == '5' || String(dataHoje.getMonth()) == '6' || String(dataHoje.getMonth()) == '7' || String(dataHoje.getMonth()) == '8' || String(dataHoje.getMonth()) == '9' ? ('0' + String(dataHoje.getMonth())) : String(dataHoje.getMonth());
            const mesHoje = mesComZero;
            const anoHoje = String(dataHoje.getFullYear());
            const entradaEstoqueItemPorItem = await Promise.all(entradaEstoqueArray.map(async (entrada) => {
                const produtoDaEntrada = await prisma_1.prisma.produtos.findFirst({
                    where: {
                        OR: [
                            {
                                barraCaixaProduto: entrada.barraCodigoEntrada,
                            },
                            {
                                barraUnitariaProduto: entrada.barraCodigoEntrada
                            }
                        ]
                    }
                });
                await prisma_1.prisma.movimentacaoprodutos.create({
                    data: {
                        codigoProduto: entrada.codigoProdutoEntrada,
                        descricaoProduto: entrada.descricaoProdutoEntrada,
                        tipoMov: 'ENTRADA DE ESTOQUE',
                        precoUnitarioItem: entrada.precoUnitarioItemEntrada,
                        precoCaixaItem: entrada.precoCaixaItemEntrada,
                        barraCaixaProd: produtoDaEntrada?.barraCaixaProduto == null || produtoDaEntrada?.barraCaixaProduto == '' ? '000000' : produtoDaEntrada?.barraCaixaProduto,
                        barraUnitariaProd: produtoDaEntrada?.barraUnitariaProduto == null || produtoDaEntrada?.barraUnitariaProduto == '' ? '000000' : produtoDaEntrada?.barraUnitariaProduto,
                        qtdeUnitariaItem: entrada.qtdeUnitariaEntrada,
                        qtdeCaixaItem: entrada.qtdeCaixaEntrada,
                        valorTotItem: 0,
                        descontoPercUnitItem: 0,
                        descontoValorUnitItem: 0,
                        descontoPercCaixaItem: 0,
                        descontoValorCaixaItem: 0,
                        acrescimoPercUnitItem: 0,
                        acrescimoPercCaixaItem: 0,
                        acrescimoValorUnitItem: 0,
                        acrescimoValorCaixaItem: 0,
                        valorComDescDaVenda: 0,
                        dataMov: anoHoje + '-' + mesHoje + '-' + diaHoje,
                    }
                });
                const existeEstoque = await prisma_1.prisma.estoqueprodutos.findFirst({
                    where: {
                        OR: [
                            {
                                barraCaixa: entrada.barraCodigoEntrada,
                            },
                            {
                                barraUnitaria: entrada.barraCodigoEntrada
                            }
                        ]
                    }
                });
                if (existeEstoque == null) {
                    await prisma_1.prisma.estoqueprodutos.create({
                        data: {
                            codigoProduto: entrada.codigoProdutoEntrada,
                            descricaoProduto: entrada.descricaoProdutoEntrada,
                            qtdeEstoqueUnitaria: entrada.qtdeUnitariaEntrada,
                            qtdeEstoqueCaixa: entrada.qtdeCaixaEntrada,
                            barraCaixa: produtoDaEntrada?.barraCaixaProduto == null ? '999999' : produtoDaEntrada?.barraCaixaProduto,
                            barraUnitaria: produtoDaEntrada?.barraUnitariaProduto == null ? '999999' : produtoDaEntrada?.barraUnitariaProduto,
                        }
                    });
                }
                else {
                    await prisma_1.prisma.estoqueprodutos.update({
                        data: {
                            qtdeEstoqueUnitaria: {
                                increment: entrada.qtdeUnitariaEntrada
                            },
                            qtdeEstoqueCaixa: {
                                increment: entrada.qtdeCaixaEntrada
                            },
                            barraCaixa: produtoDaEntrada?.barraCaixaProduto == null ? '999999' : produtoDaEntrada?.barraCaixaProduto,
                            barraUnitaria: produtoDaEntrada?.barraUnitariaProduto == null ? '999999' : produtoDaEntrada?.barraUnitariaProduto,
                        },
                        where: {
                            codigoProduto: entrada.codigoProdutoEntrada,
                        }
                    });
                }
                ;
            }));
            return reply.status(200).send({ message: 'Entrada feita com sucesso!' });
        }
        catch (error) {
            console.error(error.message);
            return reply.status(400).send({ message: 'Erro ao dar entrada. Erro: ' + error.message });
        }
    });
}
exports.entradaEstoqueRoutes = entradaEstoqueRoutes;
;
async function saidaEstoqueRoutes(fastify) {
    fastify.post('/saidaestoque/consultaprodutosaida', async function (request) {
        const saidaEstoqueBody = zod_1.z.object({
            codigoBarras: zod_1.z.string()
        });
        const { codigoBarras } = saidaEstoqueBody.parse(request.body);
        try {
            const produtoSaida = await prisma_1.prisma.produtos.findMany({
                where: {
                    OR: [
                        {
                            barraCaixaProduto: codigoBarras
                        },
                        {
                            barraUnitariaProduto: codigoBarras
                        }
                    ]
                }
            });
            return produtoSaida;
        }
        catch (error) {
            console.error(error.message);
        }
    });
    fastify.post('/saidaestoque/novasaida', async function (request, reply) {
        try {
            const novaSaidaEstoqueBody = zod_1.z.array(zod_1.z.object({
                codigoProdutoEntrada: zod_1.z.string(),
                descricaoProdutoEntrada: zod_1.z.string(),
                barraCodigoEntrada: zod_1.z.string(),
                qtdeUnitariaEntrada: zod_1.z.number(),
                qtdeCaixaEntrada: zod_1.z.number(),
            }));
            const saidaEstoqueArray = novaSaidaEstoqueBody.parse(request.body);
            const dataHoje = new Date();
            const diaComZero = String(dataHoje.getDate()) == '1' || String(dataHoje.getDate()) == '2' || String(dataHoje.getDate()) == '3' || String(dataHoje.getDate()) == '4' || String(dataHoje.getDate()) == '5' || String(dataHoje.getDate()) == '6' || String(dataHoje.getDate()) == '7' || String(dataHoje.getDate()) == '8' || String(dataHoje.getDate()) == '9' ? ('0' + String(dataHoje.getDate())) : String(dataHoje.getDate());
            const diaHoje = diaComZero;
            const mesComZero = String(dataHoje.getMonth()) == '1' || String(dataHoje.getMonth()) == '2' || String(dataHoje.getMonth()) == '3' || String(dataHoje.getMonth()) == '4' || String(dataHoje.getMonth()) == '5' || String(dataHoje.getMonth()) == '6' || String(dataHoje.getMonth()) == '7' || String(dataHoje.getMonth()) == '8' || String(dataHoje.getMonth()) == '9' ? ('0' + String(dataHoje.getMonth())) : String(dataHoje.getMonth());
            const mesHoje = mesComZero;
            const anoHoje = String(dataHoje.getFullYear());
            const saidaEstoqueItemPorItem = await Promise.all(saidaEstoqueArray.map(async (saida) => {
                const produtoDaSaida = await prisma_1.prisma.produtos.findFirst({
                    where: {
                        OR: [
                            {
                                barraCaixaProduto: saida.barraCodigoEntrada,
                            },
                            {
                                barraUnitariaProduto: saida.barraCodigoEntrada
                            }
                        ]
                    }
                });
                await prisma_1.prisma.movimentacaoprodutos.create({
                    data: {
                        codigoProduto: saida.codigoProdutoEntrada,
                        descricaoProduto: saida.descricaoProdutoEntrada,
                        tipoMov: 'SAIDA DE ESTOQUE',
                        precoUnitarioItem: produtoDaSaida?.precoUnitProduto == null ? 0 : produtoDaSaida?.precoUnitProduto,
                        precoCaixaItem: produtoDaSaida?.precoCaixaProduto == null ? 0 : produtoDaSaida?.precoCaixaProduto,
                        barraCaixaProd: produtoDaSaida?.barraCaixaProduto == null || produtoDaSaida?.barraCaixaProduto == '' ? '000000' : produtoDaSaida?.barraCaixaProduto,
                        barraUnitariaProd: produtoDaSaida?.barraUnitariaProduto == null || produtoDaSaida?.barraUnitariaProduto == '' ? '000000' : produtoDaSaida?.barraUnitariaProduto,
                        qtdeUnitariaItem: saida.qtdeUnitariaEntrada,
                        qtdeCaixaItem: saida.qtdeCaixaEntrada,
                        valorTotItem: 0,
                        descontoPercUnitItem: 0,
                        descontoValorUnitItem: 0,
                        descontoPercCaixaItem: 0,
                        descontoValorCaixaItem: 0,
                        acrescimoPercUnitItem: 0,
                        acrescimoPercCaixaItem: 0,
                        acrescimoValorUnitItem: 0,
                        acrescimoValorCaixaItem: 0,
                        valorComDescDaVenda: 0,
                        dataMov: anoHoje + '-' + mesHoje + '-' + diaHoje,
                    }
                });
                const existeEstoque = await prisma_1.prisma.estoqueprodutos.findFirst({
                    where: {
                        OR: [
                            {
                                barraCaixa: saida.barraCodigoEntrada,
                            },
                            {
                                barraUnitaria: saida.barraCodigoEntrada
                            }
                        ]
                    }
                });
                if (existeEstoque == null) {
                    await prisma_1.prisma.estoqueprodutos.create({
                        data: {
                            codigoProduto: saida.codigoProdutoEntrada,
                            descricaoProduto: saida.descricaoProdutoEntrada,
                            qtdeEstoqueUnitaria: saida.qtdeUnitariaEntrada,
                            qtdeEstoqueCaixa: saida.qtdeCaixaEntrada,
                            barraCaixa: produtoDaSaida?.barraCaixaProduto == null ? '999999' : produtoDaSaida?.barraCaixaProduto,
                            barraUnitaria: produtoDaSaida?.barraUnitariaProduto == null ? '999999' : produtoDaSaida?.barraUnitariaProduto,
                        }
                    });
                }
                else {
                    const qtdeUnitariaSaidaProd = (existeEstoque.qtdeEstoqueUnitaria - saida.qtdeUnitariaEntrada) < 0 ? 0 : (existeEstoque.qtdeEstoqueUnitaria - saida.qtdeUnitariaEntrada);
                    const qtdeCaixaSaidaProd = (existeEstoque.qtdeEstoqueCaixa - saida.qtdeCaixaEntrada) < 0 ? 0 : (existeEstoque.qtdeEstoqueCaixa - saida.qtdeCaixaEntrada);
                    await prisma_1.prisma.estoqueprodutos.update({
                        data: {
                            qtdeEstoqueUnitaria: qtdeUnitariaSaidaProd,
                            qtdeEstoqueCaixa: qtdeCaixaSaidaProd,
                            barraCaixa: produtoDaSaida?.barraCaixaProduto == null ? '999999' : produtoDaSaida?.barraCaixaProduto,
                            barraUnitaria: produtoDaSaida?.barraUnitariaProduto == null ? '999999' : produtoDaSaida?.barraUnitariaProduto,
                        },
                        where: {
                            codigoProduto: saida.codigoProdutoEntrada,
                        }
                    });
                }
                ;
            }));
            return reply.status(200).send({ message: 'Saída feita com sucesso!' });
        }
        catch (error) {
            console.error(error.message);
            return reply.status(400).send({ message: 'Erro ao dar saída. Erro: ' + error.message });
        }
    });
}
exports.saidaEstoqueRoutes = saidaEstoqueRoutes;
;
