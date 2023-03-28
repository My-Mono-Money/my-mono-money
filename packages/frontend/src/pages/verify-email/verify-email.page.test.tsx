import React from 'react';
import { render, screen } from '@testing-library/react';
import { VerifyEmail } from './verify-email.page';
import { MemoryRouter } from 'react-router-dom';

const renderWithHistoryState = (
  state: Record<string, string>,
  Component: React.FC,
) => {
  render(
    <MemoryRouter
      initialEntries={[
        {
          state,
        },
      ]}
    >
      <Component />
    </MemoryRouter>,
  );
};

describe('Verify email page', () => {
  beforeEach(() => {
    renderWithHistoryState(
      {
        email: 'boris.johnson@example.com',
        firstName: 'Boris',
        lastName: 'Johnson',
      },
      VerifyEmail,
    );
  });
  test('Page opens without crashes', async () => {
    expect(screen.getByText(/Дякуємо за реєстрацію/)).toBeInTheDocument();
  });

  test('Sign up link renders', async () => {
    expect(document.querySelector('a[href="/sign-up"]')).toBeInTheDocument();
  });
});
