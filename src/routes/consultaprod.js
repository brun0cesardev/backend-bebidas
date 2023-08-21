"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultaProdRoutes = void 0;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
async function consultaProdRoutes(fastify) {
    fastify.post('/consultaprod/consulta', async function (request, reply) {
        const consultaProdutoBarra = zod_1.z.object({
            barraConsultada: zod_1.z.string()
        });
        const { barraConsultada } = consultaProdutoBarra.parse(request.body);
        try {
            const produtoEncontrado = await prisma_1.prisma.produtos.findMany({
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
            });
            const qtdeCaixaEstoque = await prisma_1.prisma.estoqueprodutos.findFirst({
                select: {
                    qtdeEstoqueCaixa: true,
                },
                where: {
                    codigoProduto: produtoEncontrado[0].codigoProduto
                }
            });
            const qtdeUnitariaEstoque = await prisma_1.prisma.estoqueprodutos.findFirst({
                select: {
                    qtdeEstoqueUnitaria: true,
                },
                where: {
                    codigoProduto: produtoEncontrado[0].codigoProduto
                }
            });
            const produtoFormatado = {
                codigoProd: produtoEncontrado[0].codigoProduto,
                descricaoProd: produtoEncontrado[0].descricaoProduto,
                qtdeUnitariaEstoque: qtdeUnitariaEstoque,
                qtdeCaixaEstoque: qtdeCaixaEstoque,
                precoUnit: produtoEncontrado[0].precoUnitProduto,
                precoCaixa: produtoEncontrado[0].precoCaixaProduto,
                custoUnit: produtoEncontrado[0].custoUnitProduto,
                custoCaixa: produtoEncontrado[0].custoCaixaProduto
            };
            return produtoFormatado;
        }
        catch (error) {
            console.error(error.message);
        }
    });
}
exports.consultaProdRoutes = consultaProdRoutes;
;
