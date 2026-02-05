import { render, screen } from '@testing-library/react';
import App from './App';

// Mock fetch to avoid network errors during tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

test('renders app title', () => {
  render(<App />);
  const titleElement = screen.getByRole('heading', { name: /Restaurante Délice/i });
  expect(titleElement).toBeInTheDocument();
});
