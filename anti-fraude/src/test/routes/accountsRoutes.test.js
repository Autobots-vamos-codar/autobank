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

describe('POST em /api/admin/accounts', () => {
  it('Deve adicionar uma nova conta de usuário', async () => {
    await request(app)
      .post('/api/admin/accounts')
      .send({
        nome: 'ADM',
        email: 'admautobank@gmail.com',
        senha: 'admadm',
      })
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(201);
  });
});
