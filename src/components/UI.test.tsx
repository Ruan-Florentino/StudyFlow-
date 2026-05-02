import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../test/utils';
import { AnimatedButton } from './UI';

describe('AnimatedButton', () => {
  it('renderiza o conteudo corretamente', () => {
    render(<AnimatedButton>Clique aqui</AnimatedButton>);
    expect(screen.getByText('Clique aqui')).toBeInTheDocument();
  });

  it('chama a funcao onClick ao ser clicado', () => {
    const handleClick = vi.fn();
    render(<AnimatedButton onClick={handleClick}>Clique aqui</AnimatedButton>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('nao chama onClick quando esta desabilitado', () => {
    const handleClick = vi.fn();
    render(<AnimatedButton onClick={handleClick} disabled>Clique aqui</AnimatedButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('aplica classes de variantes corretamente', () => {
    const { rerender } = render(<AnimatedButton variant="primary">Botao</AnimatedButton>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');

    rerender(<AnimatedButton variant="danger">Botao</AnimatedButton>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-500/10');
  });
});
