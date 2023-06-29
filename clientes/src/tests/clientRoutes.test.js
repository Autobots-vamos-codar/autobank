import {
  beforeEach, afterEach, describe, it,
} from '@jest/globals';
import request from 'supertest';
import app from '../app.js';

let server;
beforeEach(() => {
  const port = 3001;
  server = app.listen(port);
});

afterEach(() => {
  server.close();
});

const validId = '649b48b62cddd1d9e69d05c7';
const fakeId = '55958602cdf53bd1574754a1';
const invalidId = '1234';

describe('GET em /api/admin/clients/id', () => {
  it('Deve retornar o cliente selecionado', async () => {
    await request(app)
      .get(`/api/admin/clients/${validId}`)
      .expect(200);
  });

  it('Deve retornar erro com id não existente', async () => {
    await request(app)
      .get(`/api/admin/clients/${fakeId}`)
      .expect(404);
  });

  it('Deve retornar erro com id em formato inválido', async () => {
    await request(app)
      .get(`/api/admin/clients/${invalidId}`)
      .expect(400);
  });
});
