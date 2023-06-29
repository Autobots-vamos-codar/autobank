import { describe, expect, it } from '@jest/globals';
import Client from '../models/Client';

describe('Testando o modelo Cliente', () => {
  const objCliente = {
    _id: '649b48b62cddd1d9e69d05c6',
    dadosPessoais: {
      nome: 'Laura Mariane Freitas',
      cpf: '93328793895',
      email: 'laura_mariane_freitas@boiago.com.br',
      telefone: '5437142907',
      rendaMensal: 1500,
    },
    endereco: {
      rua: 'Rua Ito Ruschel Rauber',
      numero: '320',
      complemento: 'ap101',
      cep: '95080170',
      cidade: 'Caxias do Sul',
      estado: 'RS',
    },
    dadosCartao: {
      numeroCartao: '5107122383899963',
      nomeTitular: 'LAURA M FREITAS',
      validade: '08/24',
      cvc: 412,
      diaVencimentoFatura: 5,
    },
  };

  it('Deve instanciar um novo Cliente', () => {
    const cliente = new Client(objCliente);

    expect(cliente).toEqual(expect.objectContaining(objCliente));
  });
});
