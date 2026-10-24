
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import * as api from './services/api';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';
import * as api from './services/api';
import { AuthProvider } from './context/AuthContext';

// Mock dependencies
jest.mock('./services/api');
jest.mock('lucide-react', () => ({
  ShoppingCart: () => null,
  Plus: () => null,
  Minus: () => null,
  X: () => null,
  ChefHat: () => null,
  Receipt: () => null,
  Menu: () => null,
  QrCode: () => null,
  LogOut: () => null,
  BarChart3: () => null,
  Utensils: () => null,
  Users: () => null,
  Mic: () => null,
  MicOff: () => null,
  Volume2: () => null,
  Clock: () => null,
  CheckCircle: () => null,
  Package: () => null,
}));
jest.mock('./components/Login', () => () => <div>Login Component</div>);
jest.mock('./components/ProtectedRoute', () => ({ children }) => <div>{children}</div>);
jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    usuario: { rol: 'cocina' },
    esClienteQR: false,
    estaAutenticado: true,
    logout: jest.fn(),
    cargando: false
  })
}));

describe('App Performance Optimization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getPedidos.mockResolvedValue([]);
    api.getPlatillos.mockResolvedValue([]);
  });

  test('calls getPedidos with true (active orders only) when in kitchen view', async () => {
    // Force kitchen view via URL mock or props if possible,
    // but App checks window.location. search/pathname.
    // simpler: The App component defaults to 'menu' but checks auth context.
    // We mocked AuthContext to return 'cocina' role, which triggers setVistaActual('cocina').

    // Also, App.js checks:
    // if ((vistaActual === 'cocina' || esPantallaCocina) && !esClienteQR) {
    //   cargarPedidos();

    // We need to wait for the effect to run.

    render(<App />);

    await waitFor(() => {
      // Expect getPedidos to be called with true
      expect(api.getPedidos).toHaveBeenCalledWith(true);
    });
  });
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
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
