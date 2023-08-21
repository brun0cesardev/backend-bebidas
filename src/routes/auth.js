"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const zod_1 = require("zod");
async function authRoutes(fastify) {
    fastify.post('/users/login', async (request) => {
        const consultaUserBody = zod_1.z.object({
            login: zod_1.z.string(),
            password: zod_1.z.string(),
        });
        const { login, password } = await consultaUserBody.parseAsync(request.body);
        let podeLogar;
        if (login.toUpperCase() == 'GUILHERME' && password == 'admin') {
            podeLogar = true;
        }
        else if (login.toUpperCase() == 'BRUNO' && password == 'dev08912') {
            podeLogar = true;
        }
        else {
            podeLogar = false;
        }
        return podeLogar;
    });
}
exports.authRoutes = authRoutes;
