import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VerifyEmail } from './verify-email.page';
import { MemoryRouter } from 'react-router-dom';
import { useSignedInAuthState } from 'auth-state/use-auth-state.hook';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('auth-state/use-auth-state.hook', () => ({
  useSignedInAuthState: jest.fn(),
}));
const queryClient = new QueryClient();

const renderComponent = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <VerifyEmail />
    </QueryClientProvider>,
    { wrapper: MemoryRouter },
  );
};

describe('Verify email page', () => {
  beforeEach(() => {
    (useSignedInAuthState as jest.Mock).mockReturnValue({
      user: {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      },
      token: 'mockToken',
      clearToken: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Page renders without crashing', () => {
    renderComponent();
    expect(screen.getByText(/Дякуємо за реєстрацію/i)).toBeInTheDocument();
  });

  test('Resend verification email button works', async () => {
    renderComponent();
    const button = screen.getByRole('button', {
      name: /відправити лист знов/i,
    });
    fireEvent.click(button);
    await waitFor(() => expect(button).toBeDisabled());
  });
});
