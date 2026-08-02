/**
 * Testes do registro de destaques (contrato §1.2, decisão D-003).
 *
 * Este é o mecanismo que substituiu o import cruzado de dataset na home. Ele
 * precisa de teste porque a falha dele é silenciosa: se o registro devolver
 * lista errada, a home simplesmente aparece sem contador — ninguém vê stack
 * trace, só uma home mais pobre.
 *
 * Rodar: npm test
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  definirDestaques, contadores, prateleiras, carregarItens,
} from '../src/destaques.js';

const ARSENAL = {
  rotulo: 'Arsenal', rota: '/arsenal', total: 251,
  fonte: 'src/data/arsenal.js — TOTAL',
  itens: async () => ({ itensDaHome: async () => [{ selo: 'FUZIL', titulo: 'MX', linha: '6.5mm' }] }),
};
const EQUIPES = { rotulo: 'Equipes', rota: '/elites', total: 26, fonte: 'src/data/elites.js' };
const CRONICAS = { rotulo: 'Crônicas', rota: '/biblioteca', itens: async () => ({ default: async () => [] }) };

test('contadores pega só quem declarou total', () => {
  definirDestaques([ARSENAL, EQUIPES, CRONICAS]);
  assert.deepEqual(contadores().map((c) => c.rotulo), ['Arsenal', 'Equipes']);
  assert.equal(contadores()[0].total, 251);
});

test('prateleiras pega só quem declarou itens', () => {
  definirDestaques([ARSENAL, EQUIPES, CRONICAS]);
  assert.deepEqual(prateleiras().map((p) => p.rotulo), ['Arsenal', 'Crônicas']);
});

test('total zero conta como contador — 0 é número, não ausência', () => {
  definirDestaques([{ rotulo: 'Vazio', rota: '/x', total: 0, fonte: 'teste' }]);
  assert.equal(contadores().length, 1);
  assert.equal(contadores()[0].total, 0);
});

test('total não-inteiro não vira contador', () => {
  definirDestaques([{ rotulo: 'Ruim', rota: '/x', total: '251' }]);
  assert.deepEqual(contadores(), []);
});

test('carregarItens resolve pelo itensDaHome do módulo', async () => {
  assert.deepEqual(await carregarItens(ARSENAL), [{ selo: 'FUZIL', titulo: 'MX', linha: '6.5mm' }]);
});

test('carregarItens aceita export default', async () => {
  const d = { rotulo: 'X', rota: '/x', itens: async () => ({ default: async () => [{ titulo: 'a' }] }) };
  assert.deepEqual(await carregarItens(d), [{ titulo: 'a' }]);
});

test('domínio que explode ao carregar não derruba a home', async () => {
  const quebrado = { rotulo: 'Quebrado', rota: '/x', itens: async () => { throw new Error('boom'); } };
  assert.deepEqual(await carregarItens(quebrado), [], 'devia devolver vazio, não propagar');
});

test('itens que não devolve array vira lista vazia', async () => {
  const torto = { rotulo: 'Torto', rota: '/x', itens: async () => ({ itensDaHome: async () => 'nada disso' }) };
  assert.deepEqual(await carregarItens(torto), []);
});

test('registro vazio é estado válido — shell sozinho não quebra', () => {
  definirDestaques([]);
  assert.deepEqual(contadores(), []);
  assert.deepEqual(prateleiras(), []);
});

test('definirDestaques ignora lixo em vez de quebrar', () => {
  definirDestaques(null);
  assert.deepEqual(contadores(), []);
  definirDestaques([null, undefined, EQUIPES]);
  assert.deepEqual(contadores().map((c) => c.rotulo), ['Equipes']);
});

/* ===== A regra que o mecanismo existe pra proteger ===== */

test('o shell não importa domínio nenhum', async () => {
  /* É a regra que sustenta o Nexus. Se alguém voltar a importar um dataset de
   * arsenal/elites/content aqui, este teste cai — e não o boot do sistema. */
  const { readFileSync, readdirSync } = await import('node:fs');
  const { join } = await import('node:path');

  const proibido = /from '.*\/data\/(arsenal|elites|cronicas|universos)\.js'/;
  const vasculhar = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? vasculhar(p) : (e.name.endsWith('.js') ? [p] : []);
  });

  const infratores = vasculhar('src').filter((p) => proibido.test(readFileSync(p, 'utf8')));
  assert.deepEqual(infratores, [], 'shell voltou a importar dataset de outro domínio');
});
