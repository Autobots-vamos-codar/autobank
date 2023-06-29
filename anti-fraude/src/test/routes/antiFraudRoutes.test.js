import {
  beforeEach, afterEach, afterAll, describe, it, expect, jest
} from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';

let server;

beforeEach(() => {
  const port = 3000;
  server = app.listen(port);
});

afterEach(() => {
  server.close();
});

afterAll((done) => {
  server.close();
  done();
});

describe('GET em /api/antiFraud', () => {
  it('Deve retornar uma lista com as Análises anti-fraude', async () => {
    await request(app)
      .get('/api/antiFraud')
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);
  });
});

let idResposta;

describe('POST em /api/antiFraud', () => {
  it('Deve adicionar uma nova Análise anti-fraud', async () => {
    const resposta = await request(app)
      .post('/api/antiFraud')
      .send({
        clientId: '649c9aa6fa5e6eb735914a53',
        transactionId: '649dc35200cc7a3a9e1c7fca',
      })
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(201);

    idResposta = resposta.body._id;
  });
  it('Não adiciona nada ao passar o body vazio', async () => {
    await request(app)
      .post('/api/antiFraud')
      .send({})
      .expect(500);
  });
});

describe('GET em /api/antiFraud/:id', () => {
  it('Deve retornar o detalhamento da Análise pelo ID', async () => {
    await request(app)
      .get(`/api/antiFraud/${idResposta}`)
      .expect(200);
  });
});

describe('GET em /api/antiFraud/under-review', () => {
  it('Deve retornar todas as Análises com o status "em análise"', async () => {
    await request(app)
      .get('/api/antiFraud/under-review')
      .expect(200);
  });
});

describe('PATCH em /api/antiFraud/:id', () => {
  it.each([
    ['status', { status: 'aprovada' }],

  ])('Deve alterar o campo %s', async (chave, param) => {
    const requisicao = { request };
    const spy = jest.spyOn(requisicao, 'request');
    await requisicao.request(app)
      .patch(`/api/antiFraud/${idResposta}`)
      .send(param)
      .expect(200);

    expect(spy).toHaveBeenCalled();
  });
});

describe('DELETE em /api/antiFraud/:id', () => {
  it('Deletar a analise de anti-fraude selecionada', async () => {
    await request(app)
      .delete(`/api/antiFraud/${idResposta}`)
      .expect(204);
  });
});
