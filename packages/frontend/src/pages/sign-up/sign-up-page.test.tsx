import React from 'react';
import { act, render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SignUp from './sign-up.page';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const fillSignUpFormCorrectly = () =>
  act(() => {
    userEvent.type(screen.getByLabelText('Імʼя'), 'Джоні');
    userEvent.type(screen.getByLabelText('Прізвище'), 'Депп');
    userEvent.type(screen.getByLabelText('Пошта'), 'johny.depp@example.com');
    userEvent.type(screen.getByLabelText('Пароль'), 'JohnyLoveRom2022!');
    userEvent.type(
      screen.getByLabelText('Повторіть пароль'),
      'JohnyLoveRom2022!',
    );
  });

const checkFormDisabling = async () => {
  expect(document.querySelector('[name=firstName]')).toBeDisabled();
  expect(document.querySelector('[name=lastName]')).toBeDisabled();
  expect(document.querySelector('[name=email]')).toBeDisabled();
  expect(document.querySelector('[name=password]')).toBeDisabled();
  expect(document.querySelector('[name=confirmPassword]')).toBeDisabled();
  expect(screen.getByText('Продовжити')).toBeDisabled();

  await waitFor(() => {
    expect(document.querySelector('[name=firstName]')).toBeEnabled();
    expect(document.querySelector('[name=lastName]')).toBeEnabled();
    expect(document.querySelector('[name=email]')).toBeEnabled();
    expect(document.querySelector('[name=password]')).toBeEnabled();
    expect(document.querySelector('[name=confirmPassword]')).toBeEnabled();
    expect(screen.getByText('Продовжити')).toBeEnabled();
  });
};

describe('Sign up page', () => {
  beforeEach(() => {
    render(<SignUp />, { wrapper: MemoryRouter });
  });

  afterEach(() => {
    cleanup();
  });

  test('Page opens without crashes', async () => {
    expect(screen.getByText(/Реєстрація/)).toBeInTheDocument();
  });

  test('Sign up form renders', async () => {
    expect(screen.getByLabelText('Імʼя')).toBeInTheDocument();
    expect(screen.getByLabelText('Прізвище')).toBeInTheDocument();
    expect(screen.getByLabelText('Пошта')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByLabelText('Повторіть пароль')).toBeInTheDocument();
    expect(screen.getByText('Продовжити')).toBeInTheDocument();
  });

  test('Sign in link renders', async () => {
    expect(document.querySelector('a[href="/sign-in"]')).toBeInTheDocument();
  });

  describe('Validation works correctly', () => {
    test('User presses immediately submit', async () => {
      act(() => {
        userEvent.click(screen.getByText('Продовжити'));
      });
      expect((await screen.findAllByText('Це поле обовʼязкове')).length).toBe(
        5,
      );
    });

    test('User enters too few characters', async () => {
      act(() => {
        userEvent.type(screen.getByLabelText('Імʼя'), 'J');
        userEvent.type(screen.getByLabelText('Прізвище'), 'D');
        userEvent.click(document.body);
      });
      expect((await screen.findAllByText('Мінімум 3 символи')).length).toBe(2);
    });

    test('User enters enough characters', async () => {
      act(() => {
        userEvent.type(screen.getByLabelText('Імʼя'), 'Johny');
        userEvent.type(screen.getByLabelText('Прізвище'), 'Depp');
        userEvent.click(document.body);
      });
      expect(screen.queryAllByText('Мінімум 3 символи').length).toBe(0);
    });

    test('User enters too much characters', async () => {
      act(() => {
        userEvent.type(screen.getByLabelText('Імʼя'), 'Johny'.repeat(10));
        userEvent.type(screen.getByLabelText('Прізвище'), 'Depp'.repeat(10));
        userEvent.click(document.body);
      });
      expect((await screen.findAllByText('Максимум 20 символів')).length).toBe(
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

    test('User enters too few characters password', async () => {
      act(() => {
        userEvent.type(screen.getByLabelText('Пароль'), 'J');
        userEvent.click(document.body);
      });
      expect(
        await screen.findByText('Пароль має містити мінімум 8 символів'),
      ).toBeInTheDocument();
    });

    test('User enters too enough characters password', async () => {
      act(() => {
        userEvent.type(screen.getByLabelText('Пароль'), 'JohnyLov');
        userEvent.click(document.body);
      });
      expect(
        await screen.findByText(
          'Пароль повинен містити принаймні один спеціальний символ',
        ),
      ).toBeInTheDocument();
    });

    test('User enters too much characters password', async () => {
      act(() => {
        userEvent.type(screen.getByLabelText('Пароль'), 'JohnyLov'.repeat(10));
        userEvent.click(document.body);
      });
      expect(
        await screen.findByText('Пароль має бути не більше 24 символів'),
      ).toBeInTheDocument();
    });

    test('User enters too enough characters and one special symbol password', async () => {
      act(() => {
        userEvent.type(screen.getByLabelText('Пароль'), 'JohnyLove2022!');
        userEvent.click(document.body);
      });
      expect(
        await screen.queryByText(
          'Пароль повинен містити принаймні один спеціальний символ',
        ),
      ).toBeNull();
    });

    test('User enters different password', async () => {
      act(() => {
        userEvent.type(
          screen.getByLabelText('Повторіть пароль'),
          'JohnyLove2022',
        );
        userEvent.click(document.body);
      });
      expect(
        await screen.findByText('Пароль не збігається'),
      ).toBeInTheDocument();
    });

    test('User enters same password', async () => {
      act(() => {
        userEvent.type(screen.getByLabelText('Пароль'), 'JohnyLove2022!');
        userEvent.type(
          screen.getByLabelText('Повторіть пароль'),
          'JohnyLove2022!',
        );
        userEvent.click(document.body);
      });
      expect(await screen.queryByText('Пароль не збігається')).toBeNull();
    });
  });

  describe('Interactions with api', () => {
    test('User successfully signed up', async () => {
      fillSignUpFormCorrectly();

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          isSuccessful: true,
        },
      });

      act(() => {
        userEvent.click(screen.getByText('Продовжити'));
      });

      await checkFormDisabling();
    });

    test('User already existing', async () => {
      fillSignUpFormCorrectly();

      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: { statusCode: 422, message: 'duplicated-entity-error' },
        },
      });

      act(() => {
        userEvent.click(screen.getByText('Продовжити'));
      });

      await checkFormDisabling();

      expect(
        await screen.findByText(
          'Користувач з поштою "johny.depp@example.com" уже зареєстрований',
        ),
      ).toBeInTheDocument();
    });

    test('Unknown error', async () => {
      fillSignUpFormCorrectly();

      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: { statusCode: 500, message: 'unknown-error' },
        },
      });

      act(() => {
        userEvent.click(screen.getByText('Продовжити'));
      });

      await checkFormDisabling();

      expect(
        await screen.findByText('Будь-ласка, спробуйте повторити пізніше'),
      ).toBeInTheDocument();
    });

    test("Can't recognize response as successful", async () => {
      fillSignUpFormCorrectly();

      mockedAxios.post.mockResolvedValueOnce({
        data: { isSuccessful: false },
      });

      act(() => {
        userEvent.click(screen.getByText('Продовжити'));
      });

      await checkFormDisabling();

      expect(
        await screen.findByText('Будь-ласка, спробуйте повторити пізніше'),
      ).toBeInTheDocument();
    });
  });
});
