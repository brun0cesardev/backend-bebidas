import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";

export async function relProdutoMaisVendidoRoutes(fastify: FastifyInstance) {
    fastify.post('/relprodutomaisvendido/consulta', async function (request, reply) {
        try {
            const produtosVendidos = await prisma.itensVenda.groupBy({
                by: ['codigoItem', 'descricaoItem', 'codVen'],
                _sum: {
                    precoCaixaItem: true,
                    precoUnitarioItem: true,
                    qtdeCaixaItem: true,
                    qtdeUnitariaItem: true  
                }
            })
            return produtosVendidos
        } catch (error: any) {
            console.error(error.message)
        }
    });
};