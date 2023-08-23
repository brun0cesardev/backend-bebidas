import { prisma } from "../lib/prisma";
import { z } from 'zod';
import { FastifyInstance } from "fastify";

export async function naoParaBackenRoutes(fastify: FastifyInstance) {
    fastify.post('/naopara/backend', async function (request, reply) {
        return 'deu boa'
    });
};