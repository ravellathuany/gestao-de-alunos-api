import { expect } from 'chai';
import { api } from '../helpers/api.js';
import { obterTokenAdmin, obterTokenAluno } from '../helpers/auth.js';
import { removerAlunos } from '../helpers/alunos.js';
import entregasDeTrabalhoDeOutroAluno from '../fixtures/entregasDeTrabalhoDeOutroAluno.json' with { type: 'json' };

describe('Entrega de trabalho em nome de outro aluno', () => {
  before(async () => {
    await removerAlunos(entregasDeTrabalhoDeOutroAluno.map((entrega) => entrega.dadosAluno));
  });

  entregasDeTrabalhoDeOutroAluno.forEach((entrega) => {
    it(entrega.testTitle, async () => {
      // Arrange
      const tokenAdmin = await obterTokenAdmin();

      await api()
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send(entrega.dadosAluno);

      const tokenAluno = await obterTokenAluno(entrega.dadosAluno.email, entrega.dadosAluno.senha);

      // Act
      const entregaResposta = await api()
        .post(`/api/alunos/${entrega.alunoIdDeOutroAluno}/trabalhos`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${tokenAluno}`)
        .send(entrega.dadosTrabalho);

      // Assert
      expect(entregaResposta.status).to.equal(entrega.statusCodeEsperado);
    });
  });
});
