import { prisma } from "../lib/prisma";
import { z } from 'zod';
import ShortUniqueId from 'short-unique-id'
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
                            barraCaixaProd: produtoDaEntrada?.barraCaixaProduto == null ? '000000' : produtoDaEntrada?.barraCaixaProduto,
                            barraUnitariaProd: produtoDaEntrada?.barraUnitariaProduto == null ? '000000' : produtoDaEntrada?.barraUnitariaProduto,
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
                            valorComDescDaVenda: 0
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