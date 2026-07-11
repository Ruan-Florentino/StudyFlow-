import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AthenaLogo } from '../components/brand/AthenaLogo';
import { AthenaLoader } from '../components/brand/AthenaLoaders';
import { AthenaNotificationBadge } from '../components/brand/AthenaNotificationBadge';
import { brand } from '../design-system/brand';

describe('Athena brand system', () => {
  it('keeps the symbol square and the horizontal signature proportional', () => {
    const { rerender } = render(<AthenaLogo variant="symbol" size={48} />);
    const symbol = screen.getByRole('img', { name: 'Logo da Athena' });
    expect(symbol).toHaveAttribute('width', '48');
    expect(symbol).toHaveAttribute('height', '48');

    rerender(<AthenaLogo variant="horizontal" size={60} accessibilityLabel="Assinatura Athena" />);
    const signature = screen.getByRole('img', { name: 'Assinatura Athena' });
    expect(Number(signature.getAttribute('width'))).toBeGreaterThan(Number(signature.getAttribute('height')));
  });

  it('exposes accessible status for branded loading and notifications', () => {
    render(
      <>
        <AthenaLoader label="Carregando plano Athena" />
        <AthenaNotificationBadge count={3} label="Revisões" />
      </>,
    );
    expect(screen.getByRole('status', { name: 'Carregando plano Athena' })).toBeInTheDocument();
    expect(screen.getByLabelText('Revisões: 3')).toBeInTheDocument();
  });

  it('uses the official primary and background colors', () => {
    expect(brand.colors.primary).toBe('#00E88F');
    expect(brand.colors.background).toBe('#050505');
  });
});
