import { prisma } from "../lib/prisma";
import { z } from 'zod';
import ShortUniqueId from 'short-unique-id'
import { FastifyInstance } from "fastify";

export async function cadastroProdutoRoutes(fastify: FastifyInstance) {
    fastify.post('/cadastroproduto/novoproduto', async (request, reply) => {
        const createProduto = z.object({
            descricaoProd: z.string(),
            qtdeUnitariaItem: z.number(),
            qtdeCaixaItem: z.number(),
            precoUnitarioItem: z.number(),
            precoCaixaItem: z.number(),
            custoUnitarioItem: z.number(),
            custoCaixaItem: z.number(),
            barraUnitariaItem: z.string(),
            barraCaixaItem: z.string(),
            usaQtdeEmCaixa: z.boolean(),
        });

        const generateCodigoProduto = new ShortUniqueId({ length: 8 });
        const codigoProdCreated = String(generateCodigoProduto()).toUpperCase();
        let produtoAEncontrar;

        const { descricaoProd,
            qtdeUnitariaItem,
            qtdeCaixaItem,
            precoUnitarioItem,
            precoCaixaItem,
            custoUnitarioItem,
            custoCaixaItem,
            barraUnitariaItem,
            barraCaixaItem,
            usaQtdeEmCaixa } = createProduto.parse(request.body);

            produtoAEncontrar = await prisma.produtos.findMany({
                where: {
                    OR: [
                        {
                            barraCaixaProduto: barraCaixaItem != '0' ? barraCaixaItem : undefined,
                        },
                        {
                            barraUnitariaProduto: barraUnitariaItem != '0' ? barraUnitariaItem : undefined,
                        },
                        {
                            barraCaixaProduto: barraUnitariaItem != '0' ? barraUnitariaItem : undefined,
                        },
                        {
                            barraUnitariaProduto: barraCaixaItem != '0' ? barraCaixaItem : undefined,
                        }
                    ],
                }
            });
    
        if (produtoAEncontrar.length <= 0) {
            try {
                await prisma.produtos.create({
                    data: {
                        codigoProduto: codigoProdCreated,
                        descricaoProduto: descricaoProd,
                        qtdeUnitaria: qtdeUnitariaItem,
                        qtdeCaixa: qtdeCaixaItem,
                        precoUnitProduto: precoUnitarioItem,
                        precoCaixaProduto: precoCaixaItem,
                        custoUnitProduto: custoUnitarioItem,
                        custoCaixaProduto: custoCaixaItem,
                        barraUnitariaProduto: barraUnitariaItem == '' ? '0' : barraUnitariaItem,
                        barraCaixaProduto: barraCaixaItem == '' ? '0' : barraCaixaItem,
                        usaQtdeCaixa: usaQtdeEmCaixa,
                    }
                })

                return reply.status(200).send({ message: 'Produto criado com sucesso.', codigoProdCreated });
            } catch (error: any) {
                console.error(error.message);
                return reply.status(400).send({ message: 'Erro ao criar o produto. Erro: ' + error.message });
            }
        } else {
            const msgErro = `Código de barras já existente no produto: ${produtoAEncontrar[0].descricaoProduto}! Produto não criado.`
            return reply.status(401).send({ message: msgErro })
        }  
    });

    fastify.post('/cadastroproduto/alteraproduto', async (request, reply) => {
        const alteraProduto = z.object({
            codigoDoProduto: z.string(),
            descricaoProd: z.string(),
            qtdeUnitariaItem: z.number(),
            qtdeCaixaItem: z.number(),
            precoUnitarioItem: z.number(),
            precoCaixaItem: z.number(),
            custoUnitarioItem: z.number(),
            custoCaixaItem: z.number(),
            barraUnitariaItem: z.string(),
            barraCaixaItem: z.string(),
            usaQtdeEmCaixa: z.boolean(),
        });

        const { codigoDoProduto,
            descricaoProd,
            qtdeUnitariaItem,
            qtdeCaixaItem,
            precoUnitarioItem,
            precoCaixaItem,
            custoUnitarioItem,
            custoCaixaItem,
            barraUnitariaItem,
            barraCaixaItem,
            usaQtdeEmCaixa } = alteraProduto.parse(request.body);

        try {
            await prisma.produtos.update({
                data: {
                    descricaoProduto: descricaoProd,
                    qtdeUnitaria: qtdeUnitariaItem,
                    qtdeCaixa: qtdeCaixaItem,
                    precoUnitProduto: precoUnitarioItem,
                    precoCaixaProduto: precoCaixaItem,
                    custoUnitProduto: custoUnitarioItem,
                    custoCaixaProduto: custoCaixaItem,
                    barraUnitariaProduto: barraUnitariaItem == '' ? '0' : barraUnitariaItem,
                    barraCaixaProduto: barraCaixaItem == '' ? '0' : barraCaixaItem,
                    usaQtdeCaixa: usaQtdeEmCaixa,
                },
                where: {
                    codigoProduto: codigoDoProduto,
                }
            })

            return reply.status(200).send({ message: 'Produto alterado com sucesso.', codigoDoProduto });
        } catch (error: any) {
            console.error(error.message);
            return reply.status(400).send({ message: 'Erro ao alterar o produto. Erro: ' + error.message });
        }
    });

    fastify.post('/cadastroproduto/consultaproduto', async function (request, reply) {
        const consultaProdutoBarra = z.object({
            barraConsultada: z.string()
        })
        const { barraConsultada } = consultaProdutoBarra.parse(request.body);
        try {
            const produtoEncontrado = await prisma.produtos.findMany({
                where: {
                    OR: [
                        {
                            barraCaixaProduto: barraConsultada
                        },
                        {
                            barraUnitariaProduto: barraConsultada
                        }
                    ]
                }
            })
            return produtoEncontrado;
        } catch (error: any) {
            console.error(error.message)
        }
    });

    fastify.post('/cadastroproduto/excluirproduto', async function (request, reply) {
        const consultaProdutoBarra = z.object({
            codigoProd: z.string()
        })
        const { codigoProd } = consultaProdutoBarra.parse(request.body);
        try {
            await prisma.produtos.delete({
                where: {
                    codigoProduto: codigoProd,
                }
            })
            return reply.status(200).send('Ok!');
        } catch (error: any) {
            console.error(error.message)
        }
    });
}