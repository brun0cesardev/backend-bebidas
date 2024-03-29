import Fastify from 'fastify'
import cors from '@fastify/cors'
import { cadastroProdutoRoutes } from './routes/cadprod'
import { authRoutes } from './routes/auth'
import { entradaEstoqueRoutes } from './routes/movestoque';
import { saidaEstoqueRoutes } from './routes/movestoque';
import { vendaRoutes } from './routes/venda';
import { desperdicioProdutoRoutes } from './routes/desperdicio';
import { dashboardRoutes } from './routes/dashboard';
import { relvendaRoutes } from './routes/relvenda';
import { consultaProdRoutes } from './routes/consultaprod';
import { consultaEstoqueRoutes } from './routes/consultaestoque';
import { prisma } from './lib/prisma';
import { naoParaBackenRoutes } from './routes/naotravaback';
import { relProdutoMaisVendidoRoutes } from './routes/relprodvendido';


async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    });

    await fastify.register(cors, {
        origin: true,
    });

    fastify.addHook('onSend', (request, reply, payload, done) => {
        reply.header('Acess-Control-Allow-Origin', 'https://front-bebidas.vercel.app');
        reply.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        done(null, payload);
    })

    await fastify.register(cadastroProdutoRoutes);
    await fastify.register(authRoutes);
    await fastify.register(entradaEstoqueRoutes);
    await fastify.register(saidaEstoqueRoutes);
    await fastify.register(vendaRoutes);
    await fastify.register(desperdicioProdutoRoutes);
    await fastify.register(dashboardRoutes);
    await fastify.register(relvendaRoutes);
    await fastify.register(consultaProdRoutes);
    await fastify.register(consultaEstoqueRoutes);
    await fastify.register(naoParaBackenRoutes);
    await fastify.register(relProdutoMaisVendidoRoutes);

    try {
        await prisma.$connect();
        console.log('Conexão com o banco de dados estabelecida.');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }

    // Inicie o servidor Fastify
    try {
        // await fastify.listen({ host: 'https://backend-bebidas.vercel.app/', port: process.env.PORT });
        fastify.listen({ port: Number(process.env.PORT) });
        console.log(`Servidor iniciado na porta 3333.`);
    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
    }
}

bootstrap()