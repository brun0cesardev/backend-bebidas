"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relvendaRoutes = void 0;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
async function relvendaRoutes(fastify) {
    fastify.post('/relvenda/consultarelvenda', async function (request, reply) {
        const dataFiltrada = zod_1.z.object({
            dataVenda: zod_1.z.string(),
            periodo: zod_1.z.string(),
        });
        const { dataVenda, periodo } = dataFiltrada.parse(request.body);
        try {
            let vendasPeriodo;
            if (periodo == 'dia') {
                vendasPeriodo = await prisma_1.prisma.vendas.findMany({
                    select: {
                        codVen: true,
                        dataVen: true,
                        valorVendaLiquido: true,
                        valorVendaBruto: true,
                        qtdeTotalUnitaria: true,
                        qtdeTotalCaixa: true,
                    },
                    where: {
                        dataVen: dataVenda,
                    },
                });
            }
            else {
                vendasPeriodo = await prisma_1.prisma.vendas.findMany({
                    select: {
                        codVen: true,
                        dataVen: true,
                        valorVendaLiquido: true,
                        valorVendaBruto: true,
                        qtdeTotalUnitaria: true,
                        qtdeTotalCaixa: true,
                    },
                    where: {
                        dataVen: {
                            contains: `-${((new Date(dataVenda + ' 00:00:00')).getMonth() + 1).toString().padStart(2, '0')}-`,
                        }
                    }
                });
            }
            ;
            let totalFiltrado = 0;
            for (let i = 0; i < vendasPeriodo.length; i++) {
                totalFiltrado = totalFiltrado + Number(vendasPeriodo[i].valorVendaLiquido);
            }
            ;
            return reply.status(200).send({ message: 'Produto alterado com sucesso.', vendasPeriodo, totalFiltrado });
        }
        catch (error) {
            console.error(error.message);
            return reply.status(400).send({ message: 'Erro ao alterar o produto. Erro: ' + error.message });
        }
    });
}
exports.relvendaRoutes = relvendaRoutes;
;
