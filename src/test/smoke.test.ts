import { describe, it, expect } from 'vitest';

describe('Smoke Test', () => {
  it('environment is working', () => {
    expect(1 + 1).toBe(2);
  });
  
  it('jsdom is available', () => {
    const div = document.createElement('div');
    expect(div).toBeDefined();
  });
  
  it('localStorage mock works', () => {
    localStorage.setItem('foo', 'bar');
    expect(localStorage.getItem('foo')).toBe('bar');
  });
});
