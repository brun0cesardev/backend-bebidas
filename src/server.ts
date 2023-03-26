import Fastify from 'fastify'
import cors from '@fastify/cors'
import { cadastroProdutoRoutes } from './routes/cadprod'
import { authRoutes } from './routes/auth'


async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        origin: true,
    })

    const port = Number(process.env.PORT || '3333');

    await fastify.register(cadastroProdutoRoutes)
    await fastify.register(authRoutes)

    await fastify.listen({ port: port })
}

bootstrap()