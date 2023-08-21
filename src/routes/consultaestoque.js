"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultaEstoqueRoutes = void 0;
const prisma_1 = require("../lib/prisma");
async function consultaEstoqueRoutes(fastify) {
    fastify.post('/consultaestoque/consultaest', async function (request, reply) {
        try {
            const produtosGeral = await prisma_1.prisma.estoqueprodutos.findMany({
                select: {
                    codigoProduto: true,
                    descricaoProduto: true,
                    qtdeEstoqueUnitaria: true,
                    qtdeEstoqueCaixa: true
                }
            });
            return produtosGeral;
        }
        catch (error) {
            console.error(error.message);
        }
    });
}
exports.consultaEstoqueRoutes = consultaEstoqueRoutes;
;
