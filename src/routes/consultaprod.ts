import { prisma } from "../lib/prisma";
import { z } from 'zod';
import { FastifyInstance } from "fastify";

export async function consultaProdRoutes(fastify: FastifyInstance) {
    fastify.post('/consultaprod/consulta', async function (request, reply) {
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

            const qtdeCaixaEstoque = await prisma.estoqueprodutos.findFirst({
                select: {
                    qtdeEstoqueCaixa: true,
                },
                where: {
                    codigoProduto: produtoEncontrado[0].codigoProduto
                }
            });
            
            const qtdeUnitariaEstoque = await prisma.estoqueprodutos.findFirst({
                select: {
                    qtdeEstoqueUnitaria: true,
                },
                where: {
                    codigoProduto: produtoEncontrado[0].codigoProduto
                }
            })

            const produtoFormatado = {
                codigoProd: produtoEncontrado[0].codigoProduto,
                descricaoProd: produtoEncontrado[0].descricaoProduto,
                qtdeUnitariaEstoque: qtdeUnitariaEstoque,
                qtdeCaixaEstoque: qtdeCaixaEstoque,
                precoUnit: produtoEncontrado[0].precoUnitProduto,
                precoCaixa: produtoEncontrado[0].precoCaixaProduto,
                custoUnit: produtoEncontrado[0].custoUnitProduto,
                custoCaixa: produtoEncontrado[0].custoCaixaProduto
            }

            return produtoFormatado;
        } catch (error: any) {
            console.error(error.message)
        }
    });
};