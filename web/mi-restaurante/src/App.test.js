
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import * as api from './services/api';

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
});
