import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Restaurante Délice heading', () => {
  render(<App />);
  // Assuming the main title is an h1
  const headingElement = screen.getByRole('heading', { name: /Restaurante Délice/i, level: 1 });
  expect(headingElement).toBeInTheDocument();
});
