import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { prisma } from "../lib/prisma";

export async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/users/login', async (request) => {
        const consultaUserBody = z.object({
            login: z.string(),
            password: z.string(),
        })

        const { login, password } = await consultaUserBody.parseAsync(request.body);

        let podeLogar;

        if (login.toUpperCase() == 'GUILHERME' && password == 'admin') {
            podeLogar =  true
        } else {
            podeLogar = false
        }

        return podeLogar;
    });


}