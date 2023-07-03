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

let createdAccount;
describe('Testes de POST em /api/admin/accounts', () => {
  it('Deve retornar a conta criada', async () => {
    createdAccount = await request(app)
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
describe('Testes de GET em /api/admin/accounts/:id', () => {
  it('Deve retornar o detalhe da conta', async () => {
    await request(app)
      .get(`/api/admin/accounts/${createdAccount.body._id}`)
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);
  });
});
describe('Testes de PUT em /api/admin/accounts/:id', () => {
  it('Deve retornar o detalhe da conta', async () => {
    await request(app)
      .put(`/api/admin/accounts/${createdAccount.body._id}`)
      .set('Accept', 'application/json')
      .send({
        nome: 'admin22',
        email: 'admin2@hotmail',
        senha: 'admin',
      })
      .expect(204);
  });
});
