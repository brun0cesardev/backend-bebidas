import { prisma } from "../lib/prisma";
import { z } from 'zod';
import ShortUniqueId from 'short-unique-id'
import { FastifyInstance } from "fastify";

export async function entradaEstoqueRoutes(fastify: FastifyInstance) {
    fastify.post('/entradaestoque/novaentrada', async function (request, reply) {
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
        }  catch (error: any) {
            console.error(error.message)
        }
    });
};