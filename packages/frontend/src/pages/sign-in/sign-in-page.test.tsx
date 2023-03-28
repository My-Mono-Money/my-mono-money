import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignIn from './sign-in.page';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhby5zYWxlbmtvK2pvaG5ueS5kZXBwQGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6ItCU0LbQvtC90L3RliIsImxhc3ROYW1lIjoi0JTQtdC_0L8iLCJzaWQiOiJjYzhlNjQzNi0wMmY0LTQ2OGMtOTE2ZC05YjkzMDAwNDcxNzciLCJpYXQiOjE1MTYyMzkwMjJ9.DM5XibsUN6PNz2rEjmrVA9_MuCVrYi1I4HoPaXY-fEE';

const checkFormDisabling = async () => {
  expect(document.querySelector('[name=email]')).toBeDisabled();
  expect(document.querySelector('[name=password]')).toBeDisabled();
  expect(screen.getByText('Увійти')).toBeDisabled();

  await waitFor(() => {
    expect(document.querySelector('[name=email]')).toBeEnabled();
    expect(document.querySelector('[name=password]')).toBeEnabled();
    expect(screen.getByText('Увійти')).toBeEnabled();
  });
};

const fillSignInFormCorrectly = () =>
  act(() => {
    userEvent.type(screen.getByLabelText('Пошта'), 'johny.depp@example.com');
    userEvent.type(screen.getByLabelText('Пароль'), 'JohnyLoveRom2022!');
  });

const fillSignInFormIncorrectly = () =>
  act(() => {
    userEvent.type(screen.getByLabelText('Пошта'), 'johny.depp@example.com');
    userEvent.type(screen.getByLabelText('Пароль'), 'JohnyLoveRom2022');
  });

describe('Sign in page', () => {
  beforeEach(() => {
    render(<SignIn />, { wrapper: MemoryRouter });
  });

  afterEach(() => {
    cleanup();
  });

  test('Page opens without crashes', async () => {
    expect(screen.getByText(/Вхід у кабінет/)).toBeInTheDocument();
  });

  test('Sign in form renders', async () => {
    expect(screen.getByLabelText('Пошта')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByText('Увійти')).toBeInTheDocument();
  });

  test('Sign up link renders', async () => {
    expect(document.querySelector('a[href="/sign-up"]')).toBeInTheDocument();
  });

  test('Forgot password link renders', async () => {
    expect(
      document.querySelector('a[href="/forgot-password"]'),
    ).toBeInTheDocument();
  });

  describe('Validation works correctly', () => {
    test('User presses immediately submit', async () => {
      act(() => {
        userEvent.click(screen.getByText('Увійти'));
      });
      expect((await screen.findAllByText('Це поле обовʼязкове')).length).toBe(
        2,
      );
    });

    test('User enters invalid email', async () => {
      act(() => {
        userEvent.type(screen.getByLabelText('Пошта'), 'johny.depp@examplecom');
        userEvent.click(document.body);
      });
      expect(
        await screen.findByText('Некоректний формат пошти'),
      ).toBeInTheDocument();
    });

    test('User enters valid email', async () => {
      act(() => {
        userEvent.type(
          screen.getByLabelText('Пошта'),
          'johny.depp@example.com',
        );
        userEvent.click(document.body);
      });
      expect(await screen.queryByText('Некоректний формат пошти')).toBeNull();
    });
  });

  describe('Integration with api', () => {
    test('User successfully signed in', async () => {
      fillSignInFormCorrectly();

      mockedAxios.post.mockResolvedValue({
        data: {
          accessToken: mockedAccessToken,
        },
      });

      act(() => {
        userEvent.click(screen.getByText('Увійти'));
      });

      await checkFormDisabling();
    });

    test('Incorrect password or email', async () => {
      fillSignInFormIncorrectly();

      mockedAxios.post.mockRejectedValue({
        response: {
          data: { statusCode: 401, message: 'unauthorized-error' },
        },
      });

      act(() => {
        userEvent.click(screen.getByText('Увійти'));
      });

      await checkFormDisabling();

      expect(
        await screen.findByText('Неправильний пароль або пошта'),
      ).toBeInTheDocument();
    });

    test('Unknown error', async () => {
      fillSignInFormCorrectly();

      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: { statusCode: 500, message: 'unknown-error' },
        },
      });

      act(() => {
        userEvent.click(screen.getByText('Увійти'));
      });

      await checkFormDisabling();

      expect(
        await screen.findByText('Будь-ласка, спробуйте повторити пізніше'),
      ).toBeInTheDocument();
    });

    test("Can't recognize response as successful", async () => {
      fillSignInFormCorrectly();

      mockedAxios.post.mockResolvedValueOnce({
        data: { isSuccessful: false },
      });

      act(() => {
        userEvent.click(screen.getByText('Увійти'));
      });

      await checkFormDisabling();

      expect(
        await screen.findByText('Будь-ласка, спробуйте повторити пізніше'),
      ).toBeInTheDocument();
    });
  });
});
