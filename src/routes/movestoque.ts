import { prisma } from "../lib/prisma";
import { z } from 'zod';
import { FastifyInstance } from "fastify";

export async function entradaEstoqueRoutes(fastify: FastifyInstance) {
    fastify.post('/entradaestoque/consultaproduto', async function (request) {
        const entradaEstoqueBody = z.object({
            codigoBarras: z.string()
        });

        const { codigoBarras } = entradaEstoqueBody.parse(request.body);

        try {
            const produtoEntrada = await prisma.produtos.findMany({
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
        } catch (error: any) {
            console.error(error.message);
        }
    });

    fastify.post('/entradaestoque/novaentrada', async function (request, reply) {
        try {
            const novaEntradaEstoqueBody = z.array(z.object({
                codigoProdutoEntrada: z.string(),
                descricaoProdutoEntrada: z.string(),
                precoUnitarioItemEntrada: z.number(),
                precoCaixaItemEntrada: z.number(),
                barraCodigoEntrada: z.string(),
                qtdeUnitariaEntrada: z.number(),
                qtdeCaixaEntrada: z.number(),
            }));

            const entradaEstoqueArray = novaEntradaEstoqueBody.parse(request.body);

            const entradaEstoqueItemPorItem = await Promise.all(
                entradaEstoqueArray.map(async (entrada) => {
                    const produtoDaEntrada = await prisma.produtos.findFirst({
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

                    await prisma.movimentacaoprodutos.create({
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
                        }
                    });

                    const existeEstoque = await prisma.estoqueprodutos.findFirst({
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
                        await prisma.estoqueprodutos.create({
                            data: {
                                codigoProduto: entrada.codigoProdutoEntrada,
                                descricaoProduto: entrada.descricaoProdutoEntrada,
                                qtdeEstoqueUnitaria: entrada.qtdeUnitariaEntrada,
                                qtdeEstoqueCaixa: entrada.qtdeCaixaEntrada,
                                barraCaixa: produtoDaEntrada?.barraCaixaProduto == null ? '999999' : produtoDaEntrada?.barraCaixaProduto,
                                barraUnitaria: produtoDaEntrada?.barraUnitariaProduto == null ? '999999' : produtoDaEntrada?.barraUnitariaProduto,
                            }
                        });
                    } else {
                        await prisma.estoqueprodutos.update({
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
                    };
                })
            );
            return reply.status(200).send({ message: 'Entrada feita com sucesso!' });
        } catch (error: any) {
            console.error(error.message);
            return reply.status(400).send({ message: 'Erro ao dar entrada. Erro: ' + error.message });
        }
    });
};

export async function saidaEstoqueRoutes(fastify: FastifyInstance) {
    fastify.post('/saidaestoque/consultaprodutosaida', async function (request) {
        const saidaEstoqueBody = z.object({
            codigoBarras: z.string()
        });

        const { codigoBarras } = saidaEstoqueBody.parse(request.body);

        try {
            const produtoSaida = await prisma.produtos.findMany({
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
        } catch (error: any) {
            console.error(error.message);
        }
    });

    fastify.post('/saidaestoque/novasaida', async function (request, reply) {
        try {
            const novaSaidaEstoqueBody = z.array(z.object({
                codigoProdutoEntrada: z.string(),
                descricaoProdutoEntrada: z.string(),
                barraCodigoEntrada: z.string(),
                qtdeUnitariaEntrada: z.number(),
                qtdeCaixaEntrada: z.number(),
            }));

            const saidaEstoqueArray = novaSaidaEstoqueBody.parse(request.body);

            const saidaEstoqueItemPorItem = await Promise.all(
                saidaEstoqueArray.map(async (saida) => {
                    const produtoDaSaida = await prisma.produtos.findFirst({
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

                    await prisma.movimentacaoprodutos.create({
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
                            valorComDescDaVenda: 0
                        }
                    });

                    const existeEstoque = await prisma.estoqueprodutos.findFirst({
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
                        await prisma.estoqueprodutos.create({
                            data: {
                                codigoProduto: saida.codigoProdutoEntrada,
                                descricaoProduto: saida.descricaoProdutoEntrada,
                                qtdeEstoqueUnitaria: saida.qtdeUnitariaEntrada,
                                qtdeEstoqueCaixa: saida.qtdeCaixaEntrada,
                                barraCaixa: produtoDaSaida?.barraCaixaProduto == null ? '999999' : produtoDaSaida?.barraCaixaProduto,
                                barraUnitaria: produtoDaSaida?.barraUnitariaProduto == null ? '999999' : produtoDaSaida?.barraUnitariaProduto,
                            }
                        });
                    } else {
                        const qtdeUnitariaSaidaProd = (existeEstoque.qtdeEstoqueUnitaria - saida.qtdeUnitariaEntrada) < 0 ? 0 : (existeEstoque.qtdeEstoqueUnitaria - saida.qtdeUnitariaEntrada);
                        const qtdeCaixaSaidaProd = (existeEstoque.qtdeEstoqueCaixa - saida.qtdeCaixaEntrada) < 0 ? 0 : (existeEstoque.qtdeEstoqueCaixa - saida.qtdeCaixaEntrada);
                        await prisma.estoqueprodutos.update({
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
                    };
                })
            );
            return reply.status(200).send({ message: 'Saída feita com sucesso!' });
        } catch (error: any) {
            console.error(error.message);
            return reply.status(400).send({ message: 'Erro ao dar saída. Erro: ' + error.message });
        }
    });
};