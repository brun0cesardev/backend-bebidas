import { prisma } from "../lib/prisma";
import { z } from 'zod';
import { FastifyInstance } from "fastify";

export async function desperdicioProdutoRoutes(fastify: FastifyInstance) {
    fastify.post('/desperdicio/selectproduto', async function (request) {
        const consultaProdutoBarra = z.object({
            codigoBarras: z.string()
        })
        const { codigoBarras } = consultaProdutoBarra.parse(request.body);
        try {
            const produtoEncontrado = await prisma.produtos.findMany({
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
            })
            return produtoEncontrado;
        } catch (error: any) {
            console.error(error.message)
        }
    });

    fastify.post('/desperdicio/novodesperdicio', async function (request, reply) {
        const desperdicioNovoArray = z.array(z.object({
            codigoProduto: z.string(),
            descricaoProduto: z.string(),
            precoUnitProduto: z.number(),
            precoCaixaProduto: z.number(),
            custoUnitProduto: z.number(),
            custoCaixaProduto: z.number(),
            qtdeUnitaria: z.number(),
            qtdeCaixa: z.number(),
            barraCodigo: z.string()
        }));

        const novoDesperdicios = desperdicioNovoArray.parse(request.body);

        try {
            const dataHoje = new Date();
            const diaHoje = String(dataHoje.getDate());
            const mesHoje = String(dataHoje.getMonth());
            const anoHoje = String(dataHoje.getFullYear());
    
            await Promise.all(
                novoDesperdicios.map(async (desperdicio) => {
                    const produtoDesperdicado = await prisma.produtos.findFirst({
                        where: {
                            codigoProduto: desperdicio.codigoProduto,
                        },
                    });
    
                    let totItemValor = 0;
                    let totItemValorCaixa = 0;
    
                    if (desperdicio.qtdeUnitaria > 0) {
                        totItemValor = (desperdicio.qtdeUnitaria * desperdicio.precoUnitProduto);
                    };
    
                    if (desperdicio.qtdeCaixa > 0) {
                        totItemValorCaixa = ((desperdicio.qtdeCaixa / desperdicio.qtdeCaixa) * desperdicio.precoCaixaProduto);
                    };
    
                    await prisma.movimentacaoprodutos.create({
                        data: {
                            codigoProduto: desperdicio.codigoProduto,
                            descricaoProduto: desperdicio.descricaoProduto,
                            qtdeUnitariaItem: desperdicio.qtdeUnitaria,
                            qtdeCaixaItem: desperdicio.qtdeCaixa,
                            tipoMov: 'SAÍDA DE DESPERDÍCIO',
                            dataMov: anoHoje + '-' + mesHoje + '-' + diaHoje,
                            precoCaixaItem: desperdicio.precoCaixaProduto,
                            precoUnitarioItem: desperdicio.precoUnitProduto,
                            acrescimoPercCaixaItem: 0,
                            acrescimoPercUnitItem: 0,
                            acrescimoValorCaixaItem: 0,
                            acrescimoValorUnitItem: 0,
                            barraCaixaProd: produtoDesperdicado?.barraCaixaProduto == null || produtoDesperdicado?.barraCaixaProduto == '' ? '0000' : produtoDesperdicado.barraCaixaProduto,
                            barraUnitariaProd: produtoDesperdicado?.barraUnitariaProduto == null || produtoDesperdicado?.barraUnitariaProduto == '' ? '0000' : produtoDesperdicado.barraUnitariaProduto,
                            descontoPercCaixaItem: 0,
                            descontoPercUnitItem: 0,
                            descontoValorCaixaItem: 0,
                            descontoValorUnitItem: 0,
                            valorComDescDaVenda: 0,
                            valorTotItem: totItemValor + totItemValorCaixa,
                        }
                    });

                    const existeEstoque = await prisma.estoqueprodutos.findFirst({
                        where: {
                            codigoProduto: desperdicio.codigoProduto,
                        }
                    });

                    if (existeEstoque == null) {
                        await prisma.estoqueprodutos.create({
                            data: {
                                codigoProduto: desperdicio.codigoProduto,
                                descricaoProduto: desperdicio.descricaoProduto,
                                qtdeEstoqueUnitaria: desperdicio.qtdeUnitaria,
                                qtdeEstoqueCaixa: desperdicio.qtdeCaixa,
                                barraCaixa: produtoDesperdicado?.barraCaixaProduto == null ? '999999' : produtoDesperdicado?.barraCaixaProduto,
                                barraUnitaria: produtoDesperdicado?.barraUnitariaProduto == null ? '999999' : produtoDesperdicado?.barraUnitariaProduto,
                            }
                        });
                    } else {
                        const qtdeUnitariaSaidaProd = (existeEstoque.qtdeEstoqueUnitaria - desperdicio.qtdeUnitaria) < 0 ? 0 : (existeEstoque.qtdeEstoqueUnitaria - desperdicio.qtdeUnitaria);
                        const qtdeCaixaSaidaProd = (existeEstoque.qtdeEstoqueCaixa - desperdicio.qtdeCaixa) < 0 ? 0 : (existeEstoque.qtdeEstoqueCaixa - desperdicio.qtdeCaixa);
                        await prisma.estoqueprodutos.update({
                            data: {
                                qtdeEstoqueUnitaria: qtdeUnitariaSaidaProd,
                                qtdeEstoqueCaixa: qtdeCaixaSaidaProd,
                                barraCaixa: produtoDesperdicado?.barraCaixaProduto == null ? '999999' : produtoDesperdicado?.barraCaixaProduto,
                                barraUnitaria: produtoDesperdicado?.barraUnitariaProduto == null ? '999999' : produtoDesperdicado?.barraUnitariaProduto,
                            },
                            where: {
                                codigoProduto: desperdicio.codigoProduto,
                            }
                        });
                    };
                })
            );

            return reply.status(200).send({ message: 'Desperdício cadastrado com sucesso!' });
        } catch (error: any) {
            console.error(error.message);
            return reply.status(400).send({ message: 'Erro ao cadastrar o desperdício. Erro: ' + error.message });
        }
    });
};