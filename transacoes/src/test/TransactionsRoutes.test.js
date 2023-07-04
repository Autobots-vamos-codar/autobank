import {
  beforeEach, afterEach, afterAll, describe, it, expect,
} from '@jest/globals';
import request from 'supertest';
import app from '../app.js';

let token = '';
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
describe('Testes de POST em /api/admin/accounts', () => {
  it('Deve retornar a conta criada', async () => {
    await request(app)
      .post('/api/admin/accounts')
      .set('Accept', 'application/json')
      .send({
        nome: 'admin',
        email: 'admin2@hotmail',
        senha: 'admin',
      })
      .expect('content-type', /json/)
      .expect(201);
  });
});

describe('Logar na conta', () => {
  it('Deve retornar logar a conta', async () => {
    const loggedAccount = await request(app)
      .post('/api/accounts/login')
      .set('Accept', 'application/json')
      .send({
        email: 'admin2@hotmail',
        senha: 'admin',
      });

    token = await loggedAccount.header.authorization;
  });
});

let listTransactions;
let createdTransaction;

describe('Testes de POST', () => {
  it('Deve retornar a transação criada e aprovada', async () => {
    console.log(token);
    const createdTransactionAproved = await request(app)
      .post('/api/admin/transactions')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        valorTransacao: 10,
        nomeTitular: 'FLAVIA A GOMES',
        validade: '09/25',
        numeroCartao: '5109405218436136',
        cvc: 516,
      })
      .expect('content-type', /json/)
      .expect(201);

    console.log(createdTransactionAproved.body);
    expect(createdTransactionAproved.body.status.toLowerCase()).toEqual('aprovada');
  });
  it('Deve retornar a transação criada em análise', async () => {
    createdTransaction = await request(app)
      .post('/api/admin/transactions')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        valorTransacao: 10000,
        nomeTitular: 'FLAVIA A GOMES',
        validade: '09/25',
        numeroCartao: '5109405218436136',
        cvc: 516,
      })
      .expect('content-type', /json/)
      .expect(303);
  }, 50000);
  it('Deve retornar erro ao não enviar algum dado', async () => {
    await request(app)
      .post('/api/admin/transactions/')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        valorTransacao: 10000,
        nomeTitular: 'FLAVIA A GOMES',
        validade: '09/25',
        numeroCartao: '5109405218436136',
      })
      .expect('content-type', /json/)
      .expect(400);
  });
  it('Deve retornar erro ao não passar dados certos do número do cartão', async () => {
    await request(app)
      .post('/api/admin/transactions/')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        valorTransacao: 10000,
        nomeTitular: 'FLAVIA A',
        validade: '09/25',
        numeroCartao: '51094052184361',
        cvc: 516,
      })
      .expect('content-type', /json/)
      .expect(404);
  });
});
describe('GET em /api/admin/transactions', () => {
  it('Deve retornar uma lista de transações', async () => {
    listTransactions = await request(app)
      .get('/api/admin/transactions')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect('content-type', /json/)
      .expect(200);

    // expect(resposta.status).toEqual(200);
  });
  it('Deve retornar detalhes de uma transação', async () => {
    await request(app)
      .get(`/api/admin/transactions/${createdTransaction.body.id}`)
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);
  });

  it('Deve retornar erro ao não achar a transação', async () => {
    await request(app)
      .get('/api/admin/transactions/23232')
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(400);
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
