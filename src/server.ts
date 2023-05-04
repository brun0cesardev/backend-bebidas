import Fastify from 'fastify'
import cors from '@fastify/cors'
import { cadastroProdutoRoutes } from './routes/cadprod'
import { authRoutes } from './routes/auth'
import { entradaEstoqueRoutes } from './routes/movestoque';
import { saidaEstoqueRoutes } from './routes/movestoque';
import { vendaRoutes } from './routes/venda';
import { desperdicioProdutoRoutes } from './routes/desperdicio';


async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    });

    await fastify.register(cors, {
        origin: true,
    });

    await fastify.register(cadastroProdutoRoutes);
    await fastify.register(authRoutes);
    await fastify.register(entradaEstoqueRoutes);
    await fastify.register(saidaEstoqueRoutes);
    await fastify.register(vendaRoutes);
    await fastify.register(desperdicioProdutoRoutes);

    await fastify.listen({ port: 3333 });
}

bootstrap()