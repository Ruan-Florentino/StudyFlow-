import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from '../app/router/AppRouter';

// Mock de componentes que podem pesar no teste ou ter efeitos colaterais
vi.mock('../views/core/DashboardView', () => ({
  default: () => <div data-testid="dashboard-view">Dashboard</div>
}));

vi.mock('../views/core/NotesView', () => ({
  default: () => <div data-testid="notes-view">Notes</div>
}));

describe('AppRouter', () => {
  it('renderiza o Dashboard na rota raiz', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter />
      </MemoryRouter>
    );
    
    expect(await screen.findByTestId('dashboard-view')).toBeInTheDocument();
  });

  it('renderiza NotesView na rota /notas', async () => {
    render(
      <MemoryRouter initialEntries={['/notas']}>
        <AppRouter />
      </MemoryRouter>
    );
    
    expect(await screen.findByTestId('notes-view')).toBeInTheDocument();
  });

  it('renderiza o Modo Foco na rota /foco', async () => {
    render(
      <MemoryRouter initialEntries={['/foco']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Modo Foco' })).toBeInTheDocument();
  });

  it('renderiza o Ranking na rota /ranking', async () => {
    render(
      <MemoryRouter initialEntries={['/ranking']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Ranking Athena' })).toBeInTheDocument();
  });

  it('redireciona rota inexistente para o Dashboard', async () => {
    render(
      <MemoryRouter initialEntries={['/rota-que-nao-existe']}>
        <AppRouter />
      </MemoryRouter>
    );
    
    expect(await screen.findByTestId('dashboard-view')).toBeInTheDocument();
  });
});
