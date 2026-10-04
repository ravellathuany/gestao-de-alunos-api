import { expect } from 'chai';
import { api } from '../helpers/api.js';
import entregasDeTrabalhoSemAutenticacao from '../fixtures/entregasDeTrabalhoSemAutenticacao.json' with { type: 'json' };

describe('Entrega de trabalho sem autenticação válida', () => {
  entregasDeTrabalhoSemAutenticacao.forEach((entrega) => {
    it(entrega.testTitle, async () => {
      // Act
      const entregaResposta = await api()
        .post(`/api/alunos/${entrega.alunoId}/trabalhos`)
        .set('Content-Type', 'application/json')
        .set('Authorization', entrega.authorization)
        .send(entrega.dadosTrabalho);

      // Assert
      expect(entregaResposta.status).to.equal(entrega.statusCodeEsperado);
    });
  });
});
