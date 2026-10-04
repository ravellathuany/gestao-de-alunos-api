import { expect } from 'chai';
import { api } from '../helpers/api.js';
import { obterTokenAdmin, obterTokenAluno } from '../helpers/auth.js';
import { removerAlunos } from '../helpers/alunos.js';
import entregasDeTrabalho from '../fixtures/entregasDeTrabalho.json' with { type: 'json' };

describe('Entrega de trabalho pelo aluno', () => {
  before(async () => {
    await removerAlunos(entregasDeTrabalho.map((entrega) => entrega.dadosAluno));
  });

  entregasDeTrabalho.forEach((entrega) => {
    it(entrega.testTitle, async () => {
      // Arrange
      const tokenAdmin = await obterTokenAdmin();

      const cadastroAlunoResposta = await api()
        .post('/api/admin/alunos')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send(entrega.dadosAluno);
      const alunoId = cadastroAlunoResposta.body.id;

      await api()
        .post(`/api/admin/disciplinas/${entrega.disciplinaId}/matriculas`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ alunoId });

      const tokenAluno = await obterTokenAluno(entrega.dadosAluno.email, entrega.dadosAluno.senha);

      // Act
      const entregaResposta = await api()
        .post(`/api/alunos/${alunoId}/trabalhos`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${tokenAluno}`)
        .send({ disciplinaId: entrega.disciplinaId, ...entrega.dadosTrabalho });

      // Assert
      expect(entregaResposta.status).to.equal(entrega.statusCodeEsperado);
      expect(entregaResposta.body.alunoId).to.equal(alunoId);
      expect(entregaResposta.body.disciplinaId).to.equal(entrega.disciplinaId);
    });
  });
});
