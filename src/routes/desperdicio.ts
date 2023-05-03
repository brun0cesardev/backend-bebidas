import { prisma } from "../lib/prisma";
import { z } from 'zod';
import { FastifyInstance } from "fastify";

export async function desperdicioProdutoRoutes(fastify: FastifyInstance) {
    fastify.post('/desperdicio/selectproduto', async function (request, reply) {
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
};