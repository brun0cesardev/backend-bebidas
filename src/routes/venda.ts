import { prisma } from "../lib/prisma";
import { z } from 'zod';
import { FastifyInstance } from "fastify";

export async function vendaRoutes(fastify: FastifyInstance) {
    fastify.post('/venda/checaProduto', async function (request, reply) {
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

    fastify.post('/venda/buscaCodven', async function (request, reply) {
        try {
            const maxCodven = await prisma.vendas.findFirst({
                select: {
                    codVen: true,
                },
                orderBy: {
                    codVen: 'desc'
                }
            });

            let proximoCodven = 0;

            if (maxCodven?.codVen == null || maxCodven.codVen == undefined) {
                proximoCodven = 1;
            } else {
                proximoCodven = Number(maxCodven.codVen) + 1;
            };

            return reply.status(200).send({ message: 'Número de venda encontrado com sucesso.', proximoCodven });
        } catch (error: any) {
            console.error(error.message);
            return reply.status(400).send({ message: 'Erro ao buscar próximo número da venda. Erro: ' + error.message });
        }
    });

    fastify.post('/venda/novavenda', async function (request, reply) {
        const novaVenda = z.object({
            codVen: z.number(),
            valorVendaLiquido: z.number(),
            valorVendaBruto: z.number(),
            valorDesconto: z.number(),
            valorAcrescimo: z.number(),
            qtdeTotalUnitaria: z.number(),
            qtdeTotalCaixa: z.number(),
            percDescVenda: z.number(),
            percAcrescVenda: z.number(),
            itensVenda: z.array(z.object({
                codigoProduto: z.string(),
                descricao: z.string(),
                qtdeUnitariaItem: z.number(),
                qtdeCaixaItem: z.number(),
                precoUnitarioItem: z.number(),
                precoCaixaItem: z.number(),
                percDescItem: z.number(),
                valorDescItem: z.number(),
                percAcrescItem: z.number(),
                valorAcrescItem: z.number(),
                valorTotalItem: z.string(),
            }))
        })

        const vendaArrayBody = novaVenda.parse(request.body);

        const dataHoje = new Date();
        const diaComZero = String(dataHoje.getDate()) == '1' || String(dataHoje.getDate()) == '2' || String(dataHoje.getDate()) == '3' || String(dataHoje.getDate()) == '4' || String(dataHoje.getDate()) == '5' || String(dataHoje.getDate()) == '6' || String(dataHoje.getDate()) == '7' || String(dataHoje.getDate()) == '8' || String(dataHoje.getDate()) == '9' ?  ('0' + String(dataHoje.getDate())) : String(dataHoje.getDate());
        const diaHoje = diaComZero;
        const mesComZero = String(dataHoje.getMonth() + 1) == '1' || String(dataHoje.getMonth() + 1) == '2' || String(dataHoje.getMonth() + 1) == '3' || String(dataHoje.getMonth() + 1) == '4' || String(dataHoje.getMonth() + 1) == '5' || String(dataHoje.getMonth() + 1) == '6' || String(dataHoje.getMonth() + 1) == '7' || String(dataHoje.getMonth() + 1) == '8' || String(dataHoje.getMonth() + 1) == '9' ? ('0' + String(dataHoje.getMonth() + 1)) : String(dataHoje.getMonth() + 1); 
        const mesHoje = mesComZero;
        const anoHoje = String(dataHoje.getFullYear());

        try {
            await prisma.vendas.create({
                data: {
                    dataVen: anoHoje + '-' + mesHoje + '-' + diaHoje,
                    codVen: vendaArrayBody.codVen,
                    valorVendaLiquido: vendaArrayBody.valorVendaLiquido,
                    valorVendaBruto: vendaArrayBody.valorVendaBruto,
                    valorDesconto: vendaArrayBody.valorDesconto,
                    valorAcrescimo: vendaArrayBody.valorAcrescimo,
                    qtdeTotalUnitaria: vendaArrayBody.qtdeTotalUnitaria,
                    qtdeTotalCaixa: vendaArrayBody.qtdeTotalCaixa,
                    percDescVenda: vendaArrayBody.percDescVenda,
                    percAcrescVenda: vendaArrayBody.percAcrescVenda
                },
            }) 

            await Promise.all(vendaArrayBody.itensVenda.map(async (itemVenda) => {
                const produtoVendido = await prisma.produtos.findFirst({
                    where: {
                        codigoProduto: itemVenda.codigoProduto,
                    }
                });

                await prisma.itensVenda.create({
                    data: {
                        codVen: vendaArrayBody.codVen,
                        codigoItem: itemVenda.codigoProduto,
                        descricaoItem: itemVenda.descricao,
                        dataVen: anoHoje + '-' + mesHoje + '-' + diaHoje,
                        valorItem: parseFloat(itemVenda.valorTotalItem),
                        DescontoItem: itemVenda.valorDescItem,
                        AcrescimoItem: itemVenda.valorAcrescItem,
                        qtdeUnitariaItem: itemVenda.qtdeUnitariaItem,
                        qtdeCaixaItem: itemVenda.qtdeCaixaItem,
                        precoUnitarioItem: itemVenda.precoUnitarioItem,
                        precoCaixaItem: itemVenda.precoCaixaItem,
                        barraUnitariaItem: produtoVendido?.barraUnitariaProduto == null || produtoVendido.barraUnitariaProduto == '' || produtoVendido.barraUnitariaProduto == undefined ? '0000000000' : produtoVendido.barraUnitariaProduto,
                        barraCaixaItem: produtoVendido?.barraCaixaProduto == null || produtoVendido.barraCaixaProduto == '' || produtoVendido.barraCaixaProduto == undefined ? '0000000000' : produtoVendido.barraCaixaProduto,
                        valorItemComDescVenda:0,
                        percDescItem: itemVenda.percDescItem,
                        percAcrescItem: itemVenda.percAcrescItem,
                    }
                });

                const existeEstoque = await prisma.estoqueprodutos.findFirst({
                    where: {
                        codigoProduto: itemVenda.codigoProduto,                    }
                });

                if (existeEstoque == null) {
                    await prisma.estoqueprodutos.create({
                        data: {
                            codigoProduto: itemVenda.codigoProduto,
                            descricaoProduto: itemVenda.descricao,
                            qtdeEstoqueUnitaria: itemVenda.qtdeUnitariaItem,
                            qtdeEstoqueCaixa: itemVenda.qtdeCaixaItem,
                            barraCaixa: produtoVendido?.barraUnitariaProduto == null || produtoVendido.barraUnitariaProduto == '' || produtoVendido.barraUnitariaProduto == undefined ? '999999' : produtoVendido.barraUnitariaProduto,
                            barraUnitaria: produtoVendido?.barraCaixaProduto == null || produtoVendido.barraCaixaProduto == '' || produtoVendido.barraCaixaProduto == undefined ? '999999' : produtoVendido.barraCaixaProduto,
                        }
                    });
                } else {
                    const qtdeUnitariaSaidaProd = (existeEstoque.qtdeEstoqueUnitaria - itemVenda.qtdeUnitariaItem) < 0 ? 0 : (existeEstoque.qtdeEstoqueUnitaria - itemVenda.qtdeUnitariaItem);
                    const qtdeCaixaSaidaProd = (existeEstoque.qtdeEstoqueCaixa - itemVenda.qtdeCaixaItem) < 0 ? 0 : (existeEstoque.qtdeEstoqueCaixa - itemVenda.qtdeCaixaItem);
                    await prisma.estoqueprodutos.update({
                        data: {
                            qtdeEstoqueUnitaria: qtdeUnitariaSaidaProd,
                            qtdeEstoqueCaixa: qtdeCaixaSaidaProd,
                            barraCaixa: produtoVendido?.barraUnitariaProduto == null || produtoVendido.barraUnitariaProduto == '' || produtoVendido.barraUnitariaProduto == undefined ? '999999' : produtoVendido.barraUnitariaProduto,
                            barraUnitaria: produtoVendido?.barraCaixaProduto == null || produtoVendido.barraCaixaProduto == '' || produtoVendido.barraCaixaProduto == undefined ? '999999' : produtoVendido.barraCaixaProduto,
                        },
                        where: {
                            codigoProduto: itemVenda.codigoProduto,
                        }
                    });
                };

                await prisma.movimentacaoprodutos.create({
                    data: {
                        codigoProduto: itemVenda.codigoProduto,
                        descricaoProduto: itemVenda.descricao,
                        tipoMov: 'VENDA DE PRODUTOS NR:' + String(vendaArrayBody.codVen),
                        precoUnitarioItem: itemVenda.precoUnitarioItem == null ? 0 : itemVenda.precoUnitarioItem,
                        precoCaixaItem: itemVenda.precoCaixaItem == null ? 0 : itemVenda.precoCaixaItem,
                        barraCaixaProd:produtoVendido?.barraCaixaProduto == null || produtoVendido.barraCaixaProduto == '' || produtoVendido.barraCaixaProduto == undefined ? '000000' : produtoVendido.barraCaixaProduto,
                        barraUnitariaProd: produtoVendido?.barraUnitariaProduto == null || produtoVendido.barraUnitariaProduto == '' || produtoVendido.barraUnitariaProduto == undefined ? '000000' : produtoVendido.barraUnitariaProduto,
                        qtdeUnitariaItem: itemVenda.qtdeUnitariaItem,
                        qtdeCaixaItem: itemVenda.qtdeCaixaItem,
                        valorTotItem: parseFloat(itemVenda.valorTotalItem),
                        descontoPercUnitItem: itemVenda.percDescItem,
                        descontoValorUnitItem: itemVenda.valorDescItem,
                        descontoPercCaixaItem: 0,
                        descontoValorCaixaItem: 0,
                        acrescimoPercUnitItem: itemVenda.percAcrescItem,
                        acrescimoPercCaixaItem: 0,
                        acrescimoValorUnitItem: itemVenda.valorAcrescItem,
                        acrescimoValorCaixaItem: 0,
                        valorComDescDaVenda: 0,
                        dataMov: anoHoje + '-' + mesHoje + '-' + diaHoje,
                    }
                });

            }));

            return reply.status(200).send({ message: 'Venda efetuada com sucesso! Nr: ' + String(vendaArrayBody.codVen) });
        } catch (error: any) {
            console.error(error.message);
            return reply.status(400).send({ message: 'Erro ao efetuar a venda. Erro: ' + error.message });
        }
    });
};