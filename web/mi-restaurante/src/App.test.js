import { render, waitFor, act } from '@testing-library/react';
import App from './App';
import * as api from './services/api';

// Mock the API module
jest.mock('./services/api', () => ({
  getPedidos: jest.fn(),
  getPlatillos: jest.fn(() => Promise.resolve([])),
  getMesas: jest.fn(() => Promise.resolve([])),
  getUsuarios: jest.fn(() => Promise.resolve([])),
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    pathname: '/cocina',
    search: '',
    assign: jest.fn(),
  },
  writable: true,
});

test('polls active orders with filter when on kitchen view', async () => {
  api.getPedidos.mockResolvedValue([]);

  await act(async () => {
    render(<App />);
  });

  await waitFor(() => {
    expect(api.getPedidos).toHaveBeenCalledWith({ activos: true });
  });
});
