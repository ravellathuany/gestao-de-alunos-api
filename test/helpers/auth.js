import 'dotenv/config';
import { api } from './api.js';

let tokenAdminEmCache = null;

export async function obterTokenAdmin() {
  if (!tokenAdminEmCache) {
    const loginResposta = await api()
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: process.env.ADMIN_EMAIL,
        senha: process.env.ADMIN_SENHA,
      });

    tokenAdminEmCache = loginResposta.body.token;
  }

  return tokenAdminEmCache;
}

export async function obterTokenAluno(email, senha) {
  const loginResposta = await api()
    .post('/api/auth/login')
    .set('Content-Type', 'application/json')
    .send({ email, senha });

  return loginResposta.body.token;
}
