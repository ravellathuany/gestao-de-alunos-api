import { api } from './api.js';
import { obterTokenAdmin } from './auth.js';

export async function removerAlunos(dadosAlunos) {
  const tokenAdmin = await obterTokenAdmin();

  const listagemResposta = await api()
    .get('/api/admin/alunos')
    .set('Authorization', `Bearer ${tokenAdmin}`);

  const alunosParaRemover = listagemResposta.body.filter((alunoExistente) =>
    dadosAlunos.some(
      (dadosAluno) =>
        dadosAluno.email === alunoExistente.email || dadosAluno.matricula === alunoExistente.matricula
    )
  );

  for (const aluno of alunosParaRemover) {
    await api()
      .delete(`/api/admin/alunos/${aluno.id}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);
  }
}
