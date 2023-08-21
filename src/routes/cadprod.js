"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cadastroProdutoRoutes = void 0;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const short_unique_id_1 = __importDefault(require("short-unique-id"));
async function cadastroProdutoRoutes(fastify) {
    fastify.post('/cadastroproduto/novoproduto', async (request, reply) => {
        const createProduto = zod_1.z.object({
            descricaoProd: zod_1.z.string(),
            qtdeUnitariaItem: zod_1.z.number(),
            qtdeCaixaItem: zod_1.z.number(),
            precoUnitarioItem: zod_1.z.number(),
            precoCaixaItem: zod_1.z.number(),
            custoUnitarioItem: zod_1.z.number(),
            custoCaixaItem: zod_1.z.number(),
            barraUnitariaItem: zod_1.z.string(),
            barraCaixaItem: zod_1.z.string(),
            usaQtdeEmCaixa: zod_1.z.boolean(),
        });
        const generateCodigoProduto = new short_unique_id_1.default({ length: 8 });
        const codigoProdCreated = String(generateCodigoProduto()).toUpperCase();
        let produtoAEncontrar;
        const { descricaoProd, qtdeUnitariaItem, qtdeCaixaItem, precoUnitarioItem, precoCaixaItem, custoUnitarioItem, custoCaixaItem, barraUnitariaItem, barraCaixaItem, usaQtdeEmCaixa } = createProduto.parse(request.body);
        produtoAEncontrar = await prisma_1.prisma.produtos.findMany({
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
                await prisma_1.prisma.produtos.create({
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
                });
                return reply.status(200).send({ message: 'Produto criado com sucesso.', codigoProdCreated });
            }
            catch (error) {
                console.error(error.message);
                return reply.status(400).send({ message: 'Erro ao criar o produto. Erro: ' + error.message });
            }
        }
        else {
            const msgErro = `Código de barras já existente no produto: ${produtoAEncontrar[0].descricaoProduto}! Produto não criado.`;
            return reply.status(401).send({ message: msgErro });
        }
    });
    fastify.post('/cadastroproduto/alteraproduto', async (request, reply) => {
        const alteraProduto = zod_1.z.object({
            codigoDoProduto: zod_1.z.string(),
            descricaoProd: zod_1.z.string(),
            qtdeUnitariaItem: zod_1.z.number(),
            qtdeCaixaItem: zod_1.z.number(),
            precoUnitarioItem: zod_1.z.number(),
            precoCaixaItem: zod_1.z.number(),
            custoUnitarioItem: zod_1.z.number(),
            custoCaixaItem: zod_1.z.number(),
            barraUnitariaItem: zod_1.z.string(),
            barraCaixaItem: zod_1.z.string(),
            usaQtdeEmCaixa: zod_1.z.boolean(),
        });
        const { codigoDoProduto, descricaoProd, qtdeUnitariaItem, qtdeCaixaItem, precoUnitarioItem, precoCaixaItem, custoUnitarioItem, custoCaixaItem, barraUnitariaItem, barraCaixaItem, usaQtdeEmCaixa } = alteraProduto.parse(request.body);
        try {
            await prisma_1.prisma.produtos.update({
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
            });
            return reply.status(200).send({ message: 'Produto alterado com sucesso.', codigoDoProduto });
        }
        catch (error) {
            console.error(error.message);
            return reply.status(400).send({ message: 'Erro ao alterar o produto. Erro: ' + error.message });
        }
    });
    fastify.post('/cadastroproduto/consultaproduto', async function (request, reply) {
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
            return produtoEncontrado;
        }
        catch (error) {
            console.error(error.message);
        }
    });
    fastify.post('/cadastroproduto/excluirproduto', async function (request, reply) {
        const consultaProdutoBarra = zod_1.z.object({
            codigoProd: zod_1.z.string()
        });
        const { codigoProd } = consultaProdutoBarra.parse(request.body);
        try {
            await prisma_1.prisma.produtos.delete({
                where: {
                    codigoProduto: codigoProd,
                }
            });
            return reply.status(200).send('Ok!');
        }
        catch (error) {
            console.error(error.message);
        }
    });
}
exports.cadastroProdutoRoutes = cadastroProdutoRoutes;
