import { prisma } from "../lib/prisma";
import { z } from 'zod';
import { FastifyInstance } from "fastify";

export async function consultaEstoqueRoutes(fastify: FastifyInstance) {
    fastify.post('/consultaestoque/consultaest', async function (request, reply) {
        try {
            const produtosGeral = await prisma.estoqueprodutos.findMany({
                select: {
                    codigoProduto: true,
                    descricaoProduto: true,
                    qtdeEstoqueUnitaria: true,
                    qtdeEstoqueCaixa: true
                }
            })
            return produtosGeral
        } catch (error: any) {
            console.error(error.message)
        }
    });
};