"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
async function dashboardRoutes(fastify) {
    fastify.post('/dashboard/selectQtdeVendas', async function (request, reply) {
        const dataVendas = zod_1.z.object({
            dataVenda: zod_1.z.string()
        });
        const { dataVenda } = dataVendas.parse(request.body);
        try {
            const vendasFeitas = await prisma_1.prisma.vendas.groupBy({
                by: ['codVen'],
                _count: {
                    codVen: true
                },
                where: {
                    dataVen: dataVenda
                }
            });
            return reply.status(200).send({ message: 'Ok', vendasFeitas });
        }
        catch (error) {
            console.error(error);
            return reply.status(400).send({ message: '' + error.message });
        }
    });
    fastify.post('/dashboard/selectVlrVendas', async function (request, reply) {
        const dataVendas = zod_1.z.object({
            dataVenda: zod_1.z.string()
        });
        const { dataVenda } = dataVendas.parse(request.body);
        try {
            const valorVendas = await prisma_1.prisma.vendas.aggregate({
                _sum: {
                    valorVendaLiquido: true
                },
                where: {
                    dataVen: dataVenda
                }
            });
            return reply.status(200).send({ message: 'Ok', valorVendas });
        }
        catch (error) {
            console.error(error);
            return reply.status(400).send({ message: '' + error.message });
        }
    });
}
exports.dashboardRoutes = dashboardRoutes;
;
