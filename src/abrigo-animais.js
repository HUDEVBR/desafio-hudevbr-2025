class AbrigoAnimais {
  constructor() {
    this.animaisData = {
      Rex: { tipo: 'cão', brinquedos: ['RATO', 'BOLA'] },
      Mimi: { tipo: 'gato', brinquedos: ['BOLA', 'LASER'] },
      Fofo: { tipo: 'gato', brinquedos: ['BOLA', 'RATO', 'LASER'] },
      Zero: { tipo: 'gato', brinquedos: ['RATO', 'BOLA'] },
      Bola: { tipo: 'cão', brinquedos: ['CAIXA', 'NOVELO'] },
      Bebe: { tipo: 'cão', brinquedos: ['LASER', 'RATO', 'BOLA'] },
      Loco: { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] },
    };
    this.limiteAdocoesPorPessoa = 3;
  }

  // normaliza uma string "A,B,C" -> ['A','B','C'] (uppercase)
  _normalizeLista(str) {
    if (!str) return [];
    return str.split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.toUpperCase());
  }

  // subsequência: verifica se `animalBrinquedos` aparece na ordem em `pessoaBrinquedos`
  verificaSubsequencia(animalBrinquedos, pessoaBrinquedos) {
    let idx = 0;
    for (const brinquedo of pessoaBrinquedos) {
      if (brinquedo === animalBrinquedos[idx]) {
        idx++;
        if (idx === animalBrinquedos.length) return true;
      }
    }
    return idx === animalBrinquedos.length;
  }

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    const brinqPessoa1 = this._normalizeLista(brinquedosPessoa1);
    const brinqPessoa2 = this._normalizeLista(brinquedosPessoa2);
    const animais = (ordemAnimais || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // valida animais
    for (const nome of animais) {
      if (!this.animaisData[nome]) return { erro: 'Animal inválido' };
    }
    if (new Set(animais).size !== animais.length) return { erro: 'Animal inválido' };

    // valida duplicidade de brinquedos (por pessoa)
    if (new Set(brinqPessoa1).size !== brinqPessoa1.length ||
        new Set(brinqPessoa2).size !== brinqPessoa2.length) {
      return { erro: 'Brinquedo inválido' };
    }

    // valida brinquedos contra base (se quiser rejeitar brinquedo que não exista)
    const todosBrinquedos = new Set(
      Object.values(this.animaisData).flatMap(a => a.brinquedos)
    );
    for (const b of brinqPessoa1.concat(brinqPessoa2)) {
      if (!todosBrinquedos.has(b)) {
        return { erro: 'Brinquedo inválido' };
      }
    }

    // sets para checagens rápidas
    const setP1 = new Set(brinqPessoa1);
    const setP2 = new Set(brinqPessoa2);

    const resultado = [];
    let adocoesPessoa1 = 0;
    let adocoesPessoa2 = 0;

    for (const nome of animais) {
      const animal = this.animaisData[nome];
      const animalBrinquedos = animal.brinquedos; // já em uppercase conforme definição
      let destino = 'abrigo';

      if (nome === 'Loco') {
        // Loco só sai se houver outra adoção anterior
        if (adocoesPessoa1 + adocoesPessoa2 > 0) {
          // Loco não liga pra ordem, mas precisa que a pessoa tenha TODOS os brinquedos favoritos
          const p1TemTudo = animalBrinquedos.every(b => setP1.has(b));
          const p2TemTudo = animalBrinquedos.every(b => setP2.has(b));

          const p1Pode = p1TemTudo && (adocoesPessoa1 < this.limiteAdocoesPorPessoa);
          const p2Pode = p2TemTudo && (adocoesPessoa2 < this.limiteAdocoesPorPessoa);

          if (p1Pode && !p2Pode) {
            destino = 'pessoa 1';
            adocoesPessoa1++;
          } else if (!p1Pode && p2Pode) {
            destino = 'pessoa 2';
            adocoesPessoa2++;
          } else {
            // empate (ambos podem) ou ninguém tem todos os brinquedos → abrigo
            destino = 'abrigo';
          }
        } else {
          destino = 'abrigo';
        }
      } else {
        // regra normal: subsequência (ordem importa)
        const pessoa1Ok = this.verificaSubsequencia(animalBrinquedos, brinqPessoa1);
        const pessoa2Ok = this.verificaSubsequencia(animalBrinquedos, brinqPessoa2);

        const pessoa1Pode = pessoa1Ok && (adocoesPessoa1 < this.limiteAdocoesPorPessoa);
        const pessoa2Pode = pessoa2Ok && (adocoesPessoa2 < this.limiteAdocoesPorPessoa);

        // se ambos podem → abrigo (regra 4). Gatos não dividem já coberto por esta regra (não damos metade pra cada)
        if (pessoa1Pode && !pessoa2Pode) {
          destino = 'pessoa 1';
          adocoesPessoa1++;
        } else if (!pessoa1Pode && pessoa2Pode) {
          destino = 'pessoa 2';
          adocoesPessoa2++;
        } else {
          destino = 'abrigo';
        }
      }

      resultado.push(`${nome} - ${destino}`);
    }

    resultado.sort();
    return { lista: resultado };
  }
}

export { AbrigoAnimais as AbrigoAnimais };
