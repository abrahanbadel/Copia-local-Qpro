import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Restaurante Délice heading', () => {
  render(<App />);
  const headingElements = screen.getAllByText(/Restaurante Délice/i);
  expect(headingElements.length).toBeGreaterThan(0);
});
