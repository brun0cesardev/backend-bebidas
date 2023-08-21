"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.desperdicioProdutoRoutes = void 0;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
async function desperdicioProdutoRoutes(fastify) {
    fastify.post('/desperdicio/selectproduto', async function (request) {
        const consultaProdutoBarra = zod_1.z.object({
            codigoBarras: zod_1.z.string()
        });
        const { codigoBarras } = consultaProdutoBarra.parse(request.body);
        try {
            const produtoEncontrado = await prisma_1.prisma.produtos.findMany({
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
            return produtoEncontrado;
        }
        catch (error) {
            console.error(error.message);
        }
    });
    fastify.post('/desperdicio/novodesperdicio', async function (request, reply) {
        const desperdicioNovoArray = zod_1.z.array(zod_1.z.object({
            codigoProduto: zod_1.z.string(),
            descricaoProduto: zod_1.z.string(),
            precoUnitProduto: zod_1.z.number(),
            precoCaixaProduto: zod_1.z.number(),
            custoUnitProduto: zod_1.z.number(),
            custoCaixaProduto: zod_1.z.number(),
            qtdeUnitaria: zod_1.z.number(),
            qtdeCaixa: zod_1.z.number(),
            barraCodigo: zod_1.z.string()
        }));
        const novoDesperdicios = desperdicioNovoArray.parse(request.body);
        try {
            const dataHoje = new Date();
            const diaComZero = String(dataHoje.getDate()) == '1' || String(dataHoje.getDate()) == '2' || String(dataHoje.getDate()) == '3' || String(dataHoje.getDate()) == '4' || String(dataHoje.getDate()) == '5' || String(dataHoje.getDate()) == '6' || String(dataHoje.getDate()) == '7' || String(dataHoje.getDate()) == '8' || String(dataHoje.getDate()) == '9' ? ('0' + String(dataHoje.getDate())) : String(dataHoje.getDate());
            const diaHoje = diaComZero;
            const mesComZero = String(dataHoje.getMonth() + 1) == '1' || String(dataHoje.getMonth() + 1) == '2' || String(dataHoje.getMonth() + 1) == '3' || String(dataHoje.getMonth() + 1) == '4' || String(dataHoje.getMonth() + 1) == '5' || String(dataHoje.getMonth() + 1) == '6' || String(dataHoje.getMonth() + 1) == '7' || String(dataHoje.getMonth() + 1) == '8' || String(dataHoje.getMonth() + 1) == '9' ? ('0' + String(dataHoje.getMonth() + 1)) : String(dataHoje.getMonth() + 1);
            const mesHoje = mesComZero;
            const anoHoje = String(dataHoje.getFullYear());
            await Promise.all(novoDesperdicios.map(async (desperdicio) => {
                const produtoDesperdicado = await prisma_1.prisma.produtos.findFirst({
                    where: {
                        codigoProduto: desperdicio.codigoProduto,
                    },
                });
                let totItemValor = 0;
                let totItemValorCaixa = 0;
                if (desperdicio.qtdeUnitaria > 0) {
                    totItemValor = (desperdicio.qtdeUnitaria * desperdicio.precoUnitProduto);
                }
                ;
                if (desperdicio.qtdeCaixa > 0) {
                    totItemValorCaixa = ((desperdicio.qtdeCaixa / desperdicio.qtdeCaixa) * desperdicio.precoCaixaProduto);
                }
                ;
                await prisma_1.prisma.movimentacaoprodutos.create({
                    data: {
                        codigoProduto: desperdicio.codigoProduto,
                        descricaoProduto: desperdicio.descricaoProduto,
                        qtdeUnitariaItem: desperdicio.qtdeUnitaria,
                        qtdeCaixaItem: desperdicio.qtdeCaixa,
                        tipoMov: 'SAÍDA DE DESPERDÍCIO',
                        dataMov: anoHoje + '-' + mesHoje + '-' + diaHoje,
                        precoCaixaItem: desperdicio.precoCaixaProduto,
                        precoUnitarioItem: desperdicio.precoUnitProduto,
                        acrescimoPercCaixaItem: 0,
                        acrescimoPercUnitItem: 0,
                        acrescimoValorCaixaItem: 0,
                        acrescimoValorUnitItem: 0,
                        barraCaixaProd: produtoDesperdicado?.barraCaixaProduto == null || produtoDesperdicado?.barraCaixaProduto == '' ? '0000' : produtoDesperdicado.barraCaixaProduto,
                        barraUnitariaProd: produtoDesperdicado?.barraUnitariaProduto == null || produtoDesperdicado?.barraUnitariaProduto == '' ? '0000' : produtoDesperdicado.barraUnitariaProduto,
                        descontoPercCaixaItem: 0,
                        descontoPercUnitItem: 0,
                        descontoValorCaixaItem: 0,
                        descontoValorUnitItem: 0,
                        valorComDescDaVenda: 0,
                        valorTotItem: totItemValor + totItemValorCaixa,
                    }
                });
                const existeEstoque = await prisma_1.prisma.estoqueprodutos.findFirst({
                    where: {
                        codigoProduto: desperdicio.codigoProduto,
                    }
                });
                if (existeEstoque == null) {
                    await prisma_1.prisma.estoqueprodutos.create({
                        data: {
                            codigoProduto: desperdicio.codigoProduto,
                            descricaoProduto: desperdicio.descricaoProduto,
                            qtdeEstoqueUnitaria: desperdicio.qtdeUnitaria,
                            qtdeEstoqueCaixa: desperdicio.qtdeCaixa,
                            barraCaixa: produtoDesperdicado?.barraCaixaProduto == null ? '999999' : produtoDesperdicado?.barraCaixaProduto,
                            barraUnitaria: produtoDesperdicado?.barraUnitariaProduto == null ? '999999' : produtoDesperdicado?.barraUnitariaProduto,
                        }
                    });
                }
                else {
                    const qtdeUnitariaSaidaProd = (existeEstoque.qtdeEstoqueUnitaria - desperdicio.qtdeUnitaria) < 0 ? 0 : (existeEstoque.qtdeEstoqueUnitaria - desperdicio.qtdeUnitaria);
                    const qtdeCaixaSaidaProd = (existeEstoque.qtdeEstoqueCaixa - desperdicio.qtdeCaixa) < 0 ? 0 : (existeEstoque.qtdeEstoqueCaixa - desperdicio.qtdeCaixa);
                    await prisma_1.prisma.estoqueprodutos.update({
                        data: {
                            qtdeEstoqueUnitaria: qtdeUnitariaSaidaProd,
                            qtdeEstoqueCaixa: qtdeCaixaSaidaProd,
                            barraCaixa: produtoDesperdicado?.barraCaixaProduto == null ? '999999' : produtoDesperdicado?.barraCaixaProduto,
                            barraUnitaria: produtoDesperdicado?.barraUnitariaProduto == null ? '999999' : produtoDesperdicado?.barraUnitariaProduto,
                        },
                        where: {
                            codigoProduto: desperdicio.codigoProduto,
                        }
                    });
                }
                ;
            }));
            return reply.status(200).send({ message: 'Desperdício cadastrado com sucesso!' });
        }
        catch (error) {
            console.error(error.message);
            return reply.status(400).send({ message: 'Erro ao cadastrar o desperdício. Erro: ' + error.message });
        }
    });
}
exports.desperdicioProdutoRoutes = desperdicioProdutoRoutes;
;
