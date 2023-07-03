import {
  beforeEach, afterEach, describe, it,
} from '@jest/globals';
import request from 'supertest';
import app from '../app.js';

let server;
beforeEach(() => {
  const port = 3700;
  server = app.listen(port);
});

afterEach(() => {
  server.close();
});

const validId = '649ed1a4badaa158ab5f402c';
const fakeId = '55958602cdf53bd1574754a1';
const invalidId = '1234';

const postBodyValid = {
  numeroCartao: '5109405218436136',
  validade: '09/25',
  cvc: 516,
  nomeTitular: 'FLAVIA A GOMES',
  valorTransacao: 500,
};
const postBodyDateInvalid = {
  numeroCartao: '5109405218436136',
  validade: '09/22',
  cvc: 516,
  nomeTitular: 'FLAVIA A GOMES',
  valorTransacao: 500,
};
const postBodyInvalidProperty = {
  numeroCartao: '5109405218436136',
  validade: '09/25',
  cvc: 516,
  nomeTitular: 'FLAVIA A R GOMES',
  valorTransacao: 500,
};
const postBodyInvalidNumberCard = {
  numeroCartao: '5109405218436133',
  validade: '09/25',
  cvc: 516,
  nomeTitular: 'FLAVIA A R GOMES',
  valorTransacao: 500,
};

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

describe('POST em /api/admin/clients', () => {
  it('Deve retornar status 200', async () => {
    await request(app)
      .post('/api/admin/clients')
      .send(postBodyValid)
      .expect(200);
  });
  it('Deve retornar status 401', async () => {
    await request(app)
      .post('/api/admin/clients')
      .send(postBodyDateInvalid)
      .expect(401);
  });
  it('Deve retornar status 400', async () => {
    await request(app)
      .post('/api/admin/clients')
      .send(postBodyInvalidProperty)
      .expect(400);
  });
  it('Deve retornar status 404', async () => {
    await request(app)
      .post('/api/admin/clients')
      .send(postBodyInvalidNumberCard)
      .expect(404);
  });
});
