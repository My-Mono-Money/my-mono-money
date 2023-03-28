import React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import App from './App';

test('loader is working', async () => {
  render(<App />);

  const linkElement = screen.getByText(/Завантаження/i);
  expect(linkElement).toBeInTheDocument();
  await waitForElementToBeRemoved(linkElement);
});
