import {
  beforeEach, afterEach, afterAll, describe, it, expect, jest
} from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';

let token = '';

describe('Logar na conta', () => {
  it('Deve retornar logar a conta', async () => {
    const loggedAccount = await request(app)
      .post('/api/accounts/login')
      .set('Accept', 'application/json')
      .send({
        email: 'admautobank@gmail.com',
        senha: 'admadm',
      });

    token = await loggedAccount.header.authorization;
  });
});

describe('GET em /api/antiFraud', () => {
  it('Deve retornar uma lista com as Análises anti-fraude', async () => {
    await request(app)
      .get('/api/antiFraud')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
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
        clientId: '649ed1a4badaa158ab5f402c',
        transactionId: '64a2bf06808894ca8d07a5f3',
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('content-type', /json/)
      .expect(201);

    idResposta = resposta.body._id;
  });
  it('Não adiciona nada ao passar o body vazio', async () => {
    await request(app)
      .post('/api/antiFraud')
      .send({})
      .set('Authorization', `Bearer ${token}`)
      .expect(500);
  });
});

describe('GET em /api/antiFraud/:id', () => {
  it('Deve retornar o detalhamento da Análise pelo ID', async () => {
    await request(app)
      .get(`/api/antiFraud/${idResposta}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});

describe('GET em /api/antiFraud/under-review', () => {
  it('Deve retornar todas as Análises com o status "em análise"', async () => {
    await request(app)
      .get('/api/antiFraud/under-review')
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .send(param)
      .expect(200);

    expect(spy).toHaveBeenCalled();
  });
});

describe('DELETE em /api/antiFraud/:id', () => {
  it('Deletar a analise de anti-fraude selecionada', async () => {
    await request(app)
      .delete(`/api/antiFraud/${idResposta}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });
});
