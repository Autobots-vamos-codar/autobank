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
      .get('/api/admin/transactions/649d86d95f52bb585df676b8')
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
        nome_titular: 'José',
        validade: '02/26',
        numero: '12345678912345',
        cvc: 123,
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
        valorTransacao: 1000000,
        nome_titular: 'José',
        validade: '02/26',
        numero: '12345678912345',
        cvc: 123,
      })
      .expect('content-type', /json/)
      .expect(303);

    expect(createdTransaction.body.status.toLowerCase()).toEqual('em análise');
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
