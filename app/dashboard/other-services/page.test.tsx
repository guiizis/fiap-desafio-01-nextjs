import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import OtherServicesPage from './page';

const { useAuthSessionContextMock } = vi.hoisted(() => ({
  useAuthSessionContextMock: vi.fn(),
}));

vi.mock('@/app/context/auth-session-context', () => ({
  useAuthSessionContext: useAuthSessionContextMock,
}));

vi.mock('../_components/other-services-panel', () => ({
  OtherServicesPanel: () => <section>Mock OtherServicesPanel</section>,
}));

describe('OtherServicesPage', () => {
  beforeEach(() => {
    useAuthSessionContextMock.mockReset();
  });

  it('nao renderiza conteudo quando nao existe sessao', () => {
    useAuthSessionContextMock.mockReturnValue({
      session: null,
    });

    const { container } = render(<OtherServicesPage />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza o painel de outros servicos quando existe sessao', () => {
    useAuthSessionContextMock.mockReturnValue({
      session: {
        user: {
          id: 'user-1',
        },
      },
    });

    render(<OtherServicesPage />);

    expect(screen.getByText('Mock OtherServicesPanel')).toBeInTheDocument();
  });
});
