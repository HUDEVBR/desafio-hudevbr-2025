import { AbrigoAnimais } from "./abrigo-animais";

describe('Abrigo de Animais', () => {

  test('Deve rejeitar animal inválido', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('CAIXA,RATO', 'RATO,BOLA', 'Lulu');
    expect(resultado.erro).toBe('Animal inválido');
    expect(resultado.lista).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal', () => {
    const resultado = new AbrigoAnimais().encontraPessoas(
      'RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo');
      expect(resultado.lista[0]).toBe('Fofo - abrigo');
      expect(resultado.lista[1]).toBe('Rex - pessoa 1');
      expect(resultado.lista.length).toBe(2);
      expect(resultado.erro).toBeFalsy();
  });

  test('Deve encontrar pessoa para um animal intercalando brinquedos', () => {
    const resultado = new AbrigoAnimais().encontraPessoas('BOLA,LASER',
      'BOLA,NOVELO,RATO,LASER', 'Mimi,Fofo,Rex,Bola');

      expect(resultado.lista[0]).toBe('Bola - abrigo');
      expect(resultado.lista[1]).toBe('Fofo - pessoa 2');
      expect(resultado.lista[2]).toBe('Mimi - abrigo');
      expect(resultado.lista[3]).toBe('Rex - abrigo');
      expect(resultado.lista.length).toBe(4);
      expect(resultado.erro).toBeFalsy();
  });
  
test('Loco só sai se houver outro animal adotado e pessoa tiver os brinquedos (ordem não importa)', () => {
  // pessoa 1 tem SKATE e RATO (ambos), pessoa 2 não tem SKATE
  const resultado = new AbrigoAnimais().encontraPessoas(
    'RATO,BOLA,SKATE', // pessoa 1
    'RATO,BOLA',       // pessoa 2
    'Rex,Loco'         // ordem: Rex vem antes → deve ser adotado; depois Loco pode sair
  );

  // Verificações claras:
  expect(resultado.lista).toContain('Rex - pessoa 1');   // Rex sai
  expect(resultado.lista).toContain('Loco - pessoa 1');  // Loco também consegue sair (tem SKATE+RATO)
});

test('Empate de gato: ambas as pessoas atendem -> abrigo', () => {
  const resultado = new AbrigoAnimais().encontraPessoas(
    'BOLA,LASER',     // pessoa 1
    'BOLA,LASER',     // pessoa 2
    'Mimi'            // Mimi é gato e ambas atendem
  );
  expect(resultado.lista[0]).toBe('Mimi - abrigo');
});

test('Pessoa não pode adotar mais de 3 animais (limite)', () => {
  const resultado = new AbrigoAnimais().encontraPessoas(
    'RATO,BOLA,CAIXA,NOVELO,LASER', // brinquedos suficientes em p1
    'RATO,BOLA,CAIXA,NOVELO,LASER', // e em p2
    'Rex,Bola,Bebe,Zero'            // 4 animais possíveis
  );
  const pessoa1Count = resultado.lista.filter(r => r.includes('pessoa 1')).length;
  const pessoa2Count = resultado.lista.filter(r => r.includes('pessoa 2')).length;

  expect(pessoa1Count).toBeLessThanOrEqual(3);
  expect(pessoa2Count).toBeLessThanOrEqual(3);
});
  
  test('Deve rejeitar brinquedo inválido', () => {
  const resultado = new AbrigoAnimais().encontraPessoas(
    'RATO,FOGUETE', // "FOGUETE" não existe no banco
    'BOLA,NOVELO',
    'Rex'
  );
  expect(resultado.erro).toBe('Brinquedo inválido');
  });
  
  test('Loco vai para o abrigo se for o único na lista', () => {
  const resultado = new AbrigoAnimais().encontraPessoas(
    'RATO,BOLA',
    'RATO,BOLA',
    'Loco'
  );
  expect(resultado.lista[0]).toBe('Loco - abrigo');
  });

  test('Pessoa não adota mais de 3 animais mesmo se tiver todos os brinquedos', () => {
  const resultado = new AbrigoAnimais().encontraPessoas(
    'RATO,BOLA,CAIXA,NOVELO,LASER,SKATE',
    'RATO,BOLA,CAIXA,NOVELO,LASER,SKATE',
    'Rex,Bola,Bebe,Zero,Mimi,Fofo'
  );
  const pessoa1Count = resultado.lista.filter(r => r.includes('pessoa 1')).length;
  const pessoa2Count = resultado.lista.filter(r => r.includes('pessoa 2')).length;
  expect(pessoa1Count).toBeLessThanOrEqual(3);
  expect(pessoa2Count).toBeLessThanOrEqual(3);
  });
  
  test('Brinquedo inválido na pessoa 2 deve retornar erro', () => {
  const resultado = new AbrigoAnimais().encontraPessoas(
    'RATO,BOLA',      // pessoa1 válido
    'LASER,FOGUETE',  // pessoa2 tem brinquedo inválido "FOGUETE"
    'Mimi'
  );
  expect(resultado.erro).toBe('Brinquedo inválido');
});

test('Loco só sai se outro animal for adotado antes e pessoa tiver SKATE+RATO (ordem não importa)', () => {
  const resultado = new AbrigoAnimais().encontraPessoas(
    'SKATE,RATO,BOLA', // pessoa 1 tem SKATE e RATO e também RATO+BOLA para Rex
    'RATO',            // pessoa 2 só tem RATO
    'Rex,Loco'         // Rex vem primeiro -> deve ser adotado; então Loco pode sair
  );

  // Checagens claras
  expect(resultado.lista).toContain('Rex - pessoa 1');
  expect(resultado.lista).toContain('Loco - pessoa 1');
});

});


