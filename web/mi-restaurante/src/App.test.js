import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';
import * as api from './services/api';
import { AuthProvider } from './context/AuthContext';

// Mock dependencies
jest.mock('./services/api');
jest.mock('lucide-react', () => ({
  ShoppingCart: () => <div>ShoppingCart</div>,
  Plus: () => <div>Plus</div>,
  Minus: () => <div>Minus</div>,
  X: () => <div>X</div>,
  ChefHat: () => <div>ChefHat</div>,
  Receipt: () => <div>Receipt</div>,
  Menu: () => <div>Menu</div>,
  QrCode: () => <div>QrCode</div>,
  LogOut: () => <div>LogOut</div>,
  BarChart3: () => <div>BarChart3</div>,
  Utensils: () => <div>Utensils</div>,
  Users: () => <div>Users</div>,
  Clock: () => <div>Clock</div>,
  CheckCircle: () => <div>CheckCircle</div>,
  Package: () => <div>Package</div>,
}));

// Mock child components to isolate App testing
jest.mock('./Facturacion', () => () => <div>Facturacion Component</div>);
jest.mock('./GeneradorQR', () => () => <div>GeneradorQR Component</div>);
jest.mock('./components/Login', () => () => <div>Login Component</div>);
jest.mock('./Reportes', () => () => <div>Reportes Component</div>);
jest.mock('./GestionPlatillos', () => () => <div>GestionPlatillos Component</div>);
jest.mock('./GestionUsuarios', () => () => <div>GestionUsuarios Component</div>);
jest.mock('./Cocina', () => () => <div>Cocina Component</div>);

// Mock global fetch for AuthContext or other calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getPlatillos.mockResolvedValue([]);
    api.getPedidos.mockResolvedValue([]);
  });

  test('renders without crashing', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <App />
        </AuthProvider>
      );
    });
    // If it renders Login, it means it worked (default unauthenticated state)
    expect(screen.getByText('Login Component')).toBeInTheDocument();
  });
});
