"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const cadprod_1 = require("./routes/cadprod");
const auth_1 = require("./routes/auth");
const movestoque_1 = require("./routes/movestoque");
const movestoque_2 = require("./routes/movestoque");
const venda_1 = require("./routes/venda");
const desperdicio_1 = require("./routes/desperdicio");
const dashboard_1 = require("./routes/dashboard");
const relvenda_1 = require("./routes/relvenda");
const consultaprod_1 = require("./routes/consultaprod");
const consultaestoque_1 = require("./routes/consultaestoque");
const prisma_1 = require("./lib/prisma");
async function bootstrap() {
    const fastify = (0, fastify_1.default)({
        logger: true,
    });
    await fastify.register(cors_1.default, {
        origin: ["https://front-bebidas.vercel.app/", "http://localhost:3000"],
    });
    await fastify.register(cadprod_1.cadastroProdutoRoutes);
    await fastify.register(auth_1.authRoutes);
    await fastify.register(movestoque_1.entradaEstoqueRoutes);
    await fastify.register(movestoque_2.saidaEstoqueRoutes);
    await fastify.register(venda_1.vendaRoutes);
    await fastify.register(desperdicio_1.desperdicioProdutoRoutes);
    await fastify.register(dashboard_1.dashboardRoutes);
    await fastify.register(relvenda_1.relvendaRoutes);
    await fastify.register(consultaprod_1.consultaProdRoutes);
    await fastify.register(consultaestoque_1.consultaEstoqueRoutes);
    try {
        await prisma_1.prisma.$connect();
        console.log('Conexão com o banco de dados estabelecida.');
    }
    catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
    // Inicie o servidor Fastify
    try {
        await fastify.listen({ port: 3333 });
        console.log('Servidor iniciado na porta 3333.');
    }
    catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
    }
}
bootstrap();
