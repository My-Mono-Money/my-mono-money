import React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import App from './App';

jest.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => null,
}));

test('loader is working', async () => {
  render(<App />);

  const loaderElement = screen.getByTestId('page-loader');
  expect(loaderElement).toBeInTheDocument();
  await waitForElementToBeRemoved(loaderElement);
});
