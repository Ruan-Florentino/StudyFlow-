import { describe, it, expect } from 'vitest';
import {
  normalizeDbRole,
  parseBillingPlanFromDb,
  computeFeatureAccess,
  isDevToolsAllowed,
} from './userAccessLogic';

describe('normalizeDbRole', () => {
  it('retorna free para null ou desconhecido', () => {
    expect(normalizeDbRole(null)).toBe('free');
    expect(normalizeDbRole(undefined)).toBe('free');
    expect(normalizeDbRole('visitor')).toBe('free');
  });

  it('preserva papéis conhecidos', () => {
    expect(normalizeDbRole('premium')).toBe('premium');
    expect(normalizeDbRole('supremo')).toBe('supremo');
    expect(normalizeDbRole('admin')).toBe('admin');
  });
});

describe('parseBillingPlanFromDb', () => {
  it('normaliza valores inválidos para free', () => {
    expect(parseBillingPlanFromDb(null)).toBe('free');
    expect(parseBillingPlanFromDb('enterprise')).toBe('free');
  });

  it('aceita free, pro e premium', () => {
    expect(parseBillingPlanFromDb('free')).toBe('free');
    expect(parseBillingPlanFromDb('pro')).toBe('pro');
    expect(parseBillingPlanFromDb('premium')).toBe('premium');
  });
});

describe('computeFeatureAccess', () => {
  const base = {
    isPremiumEffective: false,
    flashcardsUsed: 0,
    aiTutorQueries: 0,
    aiTutorDate: null as string | null,
    essaysWeek: 0,
  };

  it('premium efetivo libera tudo', () => {
    expect(computeFeatureAccess({ ...base, isPremiumEffective: true }, 'exams')).toBe(true);
    expect(computeFeatureAccess({ ...base, isPremiumEffective: true }, 'flashcards')).toBe(true);
  });

  it('exames bloqueiam free', () => {
    expect(computeFeatureAccess(base, 'exams')).toBe(false);
  });

  it('flashcards respeitam limite diário free', () => {
    expect(computeFeatureAccess({ ...base, flashcardsUsed: 9 }, 'flashcards')).toBe(true);
    expect(computeFeatureAccess({ ...base, flashcardsUsed: 10 }, 'flashcards')).toBe(false);
  });

  it('aiTutor permite até 3 consultas no mesmo dia', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(computeFeatureAccess({ ...base, aiTutorDate: today, aiTutorQueries: 2 }, 'aiTutor')).toBe(true);
    expect(computeFeatureAccess({ ...base, aiTutorDate: today, aiTutorQueries: 3 }, 'aiTutor')).toBe(false);
  });

  it('redação free permite 0 por semana e bloqueia após 1', () => {
    expect(computeFeatureAccess({ ...base, essaysWeek: 0 }, 'essay')).toBe(true);
    expect(computeFeatureAccess({ ...base, essaysWeek: 1 }, 'essay')).toBe(false);
  });
});

describe('isDevToolsAllowed', () => {
  it('permite em build dev', () => {
    expect(isDevToolsAllowed({ isDevBuild: true, userEmail: null, ownerEmailEnv: undefined })).toBe(true);
  });

  it('produção: só e-mail do owner quando env definido', () => {
    expect(
      isDevToolsAllowed({
        isDevBuild: false,
        userEmail: 'owner@x.com',
        ownerEmailEnv: 'owner@x.com',
      })
    ).toBe(true);
    expect(
      isDevToolsAllowed({
        isDevBuild: false,
        userEmail: 'other@x.com',
        ownerEmailEnv: 'owner@x.com',
      })
    ).toBe(false);
  });

  it('produção sem owner env nega', () => {
    expect(
      isDevToolsAllowed({
        isDevBuild: false,
        userEmail: 'owner@x.com',
        ownerEmailEnv: '',
      })
    ).toBe(false);
  });
});
