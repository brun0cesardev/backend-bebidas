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

    // fastify.post('venda/buscaCodven', async function (request, reply) {
    //     try {
    //         const maxCodven = await prisma.vendas.findFirst({
    //             select: {
    //                 codVen: true,
    //             },
    //             orderBy: {
    //                 codVen: 'desc'
    //             }
    //         });

    //         let proximoCodven = 0;

    //         if (maxCodven == null || maxCodven == undefined) {
    //             proximoCodven = 1;
    //         } else {
    //             proximoCodven = Number(maxCodven) + 1;
    //         };

    //         return reply.status(200).send({ message: 'Número de venda encontrado com sucesso.', proximoCodven });
    //     } catch (error: any) {
    //         console.error(error.message);
    //         return reply.status(400).send({ message: 'Erro ao buscar próximo número da venda. Erro: ' + error.message });
    //     }
    // });

    // fastify.post('/venda/novavenda', async function (request, reply) {
    //     const novaVenda = z.array(z.object({
    //         codigoProduto: z.string(),
    //         descricao: z.string(),
    //         qtdeUnitariaItem: z.number(),
    //         qtdeCaixaItem: z.number(),
    //         precoUnitarioItem: z.number(),
    //         precoCaixaItem: z.number(),
    //         valorTotalItem: z.string()
    //     }));

    //     const vendaArrayBody = novaVenda.parse(request.body);

    //     await Promise.all(
    //         vendaArrayBody.map(async (itenVenda) => {
    //             const produtoDaSaida = await prisma.produtos.findUnique({
    //                 where: {
    //                     codigoProduto: itenVenda.codigoProduto
    //                 }
    //             });

    //             const ultimaVendaFeita = await prisma.vendas.findFirst({
    //                 select: {
    //                     codVen: true,
    //                 },
    //                 orderBy: {
    //                     codVen: 'desc'
    //                 }
    //             });

    //             let proximoCodven;

    //             if (ultimaVendaFeita == null || ultimaVendaFeita == undefined) {
    //                 proximoCodven = 1;
    //             } else {
    //                 proximoCodven = Number(ultimaVendaFeita) + 1;
    //             }

    //             const produtoVendido = await prisma.vendas.create({
    //                 data: {
    //                     codVen: proximoCodven,

    //                 }
    //             })
    //         })
    //     );
    // });
};