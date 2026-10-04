import { expect } from 'chai';
import { api } from '../helpers/api.js';
import { obterTokenAdmin, obterTokenAluno } from '../helpers/auth.js';
import { removerAlunos } from '../helpers/alunos.js';
import entregasDeTrabalhoInvalidas from '../fixtures/entregasDeTrabalhoInvalidas.json' with { type: 'json' };

describe('Entrega de trabalho inválida pelo aluno', () => {
  before(async () => {
    await removerAlunos(entregasDeTrabalhoInvalidas.map((entrega) => entrega.dadosAluno));
  });

  entregasDeTrabalhoInvalidas.forEach((entrega) => {
    it(entrega.testTitle, async () => {
      // Arrange
      const tokenAdmin = await obterTokenAdmin();

      const cadastroAlunoResposta = await api()
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send(entrega.dadosAluno);
      const alunoId = cadastroAlunoResposta.body.id;

      const tokenAluno = await obterTokenAluno(entrega.dadosAluno.email, entrega.dadosAluno.senha);

      // Act
      const entregaResposta = await api()
        .post(`/api/alunos/${alunoId}/trabalhos`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${tokenAluno}`)
        .send({ disciplinaId: entrega.disciplinaId, ...entrega.dadosTrabalho });

      // Assert
      expect(entregaResposta.status).to.equal(entrega.statusCodeEsperado);
    });
  });
});
