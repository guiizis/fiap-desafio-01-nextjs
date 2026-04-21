import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DashboardLayout from './layout';

describe('DashboardLayout', () => {
  it('renderiza container da area de dashboard com children', () => {
    render(
      <DashboardLayout>
        <main>Conteudo da area de dashboard</main>
      </DashboardLayout>
    );

    expect(screen.getByText('Conteudo da area de dashboard')).toBeInTheDocument();
  });
});
