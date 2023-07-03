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
