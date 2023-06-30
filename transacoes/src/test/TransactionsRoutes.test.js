import {
  beforeEach, afterEach, afterAll, describe, it, expect,
} from '@jest/globals';
import request from 'supertest';
import app from '../app.js';

let server;

beforeEach(() => {
  const port = 3002;
  server = app.listen(port);
});

afterEach(() => {
  server.close();
});

afterAll((done) => {
  server.close();
  done();
});
let listTransactions;
describe('GET em /api/admin/transactions', () => {
  it('Deve retornar uma lista de transações', async () => {
    listTransactions = await request(app)
      .get('/api/admin/transactions')
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);

    // expect(resposta.status).toEqual(200);
  });
  it('Deve retornar detalhes de uma transação', async () => {
    await request(app)
      .get('/api/admin/transactions/649da22f2534494ba8be9fcb')
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);
  });
});

let createdTransaction;
describe('Testes de POST', () => {
  it('Deve retornar a transação criada e aprovada', async () => {
    createdTransaction = await request(app)
      .post('/api/admin/transactions')
      .set('Accept', 'application/json')
      .send({
        valorTransacao: 10,
        nomeTitular: 'VICENTE C MOTA',
        validade: '02/24',
        numeroCartao: '4916642182615702',
        cvc: 989,
      })
      .expect('content-type', /json/)
      .expect(201);

    console.log(createdTransaction.body);
    expect(createdTransaction.body.status.toLowerCase()).toEqual('aprovada');
  });
  it('Deve retornar a transação criada em análise', async () => {
    createdTransaction = await request(app)
      .post('/api/admin/transactions')
      .set('Accept', 'application/json')
      .send({
        valorTransacao: 10000,
        nomeTitular: 'VICENTE C MOTA',
        validade: '02/24',
        numeroCartao: '4916642182615702',
        cvc: 989,
      })
      .expect('content-type', /json/)
      .expect(303);

    expect(createdTransaction.body.status.toLowerCase()).toEqual('em análise');
  });
  it('Deve retornar erro ao não enviar algum dado', async () => {
    await request(app)
      .post('/api/admin/transactions/')
      .set('Accept', 'application/json')
      .send({
        valorTransacao: 10000,
        nomeTitular: 'VICENTE C MOTA',
        validade: '02/24',
        numeroCartao: '4916642182615702',
      })
      .expect('content-type', /json/)
      .expect(400);
  });
  it('Deve retornar erro ao a data de cartão estiver expirada', async () => {
    await request(app)
      .post('/api/admin/transactions/')
      .set('Accept', 'application/json')
      .send({
        valorTransacao: 10000,
        nomeTitular: 'LAURA M FREITAS',
        validade: '08/21',
        numeroCartao: '5109405218436137',
        cvc: 412,
      })
      .expect('content-type', /json/)
      .expect(401);
  });
  it('Deve retornar erro ao não passar dados certos do número do cartão', async () => {
    await request(app)
      .post('/api/admin/transactions/')
      .set('Accept', 'application/json')
      .send({
        valorTransacao: 10000,
        nomeTitular: 'LAURA M FREITAS',
        validade: '08/21',
        numeroCartao: '51094052184361',
        cvc: 412,
      })
      .expect('content-type', /json/)
      .expect(404);
  });
});

describe('Testes PUT', () => {
  it('Deve atualizar o status para aprovado', async () => {
    await request(app)
      .put(`/api/admin/transactions/${createdTransaction.body.id}?status=aprovada`)
      .set('Accept', 'application/json')
      .expect(204);
  });
});
