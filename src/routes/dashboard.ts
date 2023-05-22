import { prisma } from "../lib/prisma";
import { z } from 'zod';
import { FastifyInstance } from "fastify";

export async function dashboardRoutes(fastify: FastifyInstance) {
    fastify.post('/dashboard/selectQtdeVendas', async function (request, reply) {
        const dataVendas = z.object({
            dataVenda: z.string()
        })
        const { dataVenda } = dataVendas.parse(request.body); 

        try {
            const vendasFeitas = await prisma.vendas.groupBy({
                by: ['codVen'],
                _count: {
                    codVen: true
                },
                where: {
                    dataVen: dataVenda
                }
            });
            return reply.status(200).send({ message: 'Ok', vendasFeitas });
        } catch (error: any) {
            console.error(error);
            return reply.status(400).send({ message: '' + error.message });
        }
    });

    fastify.post('/dashboard/selectVlrVendas', async function (request, reply) {
        const dataVendas = z.object({
            dataVenda: z.string()
        })
        const { dataVenda } = dataVendas.parse(request.body); 

        try {
            const valorVendas = await prisma.vendas.aggregate({
                _sum: {
                    valorVendaLiquido: true
                },
                where: {
                    dataVen: dataVenda
                }
            });
            return reply.status(200).send({ message: 'Ok', valorVendas });
        } catch (error: any) {
            console.error(error);
            return reply.status(400).send({ message: '' + error.message });
        }
    });
};