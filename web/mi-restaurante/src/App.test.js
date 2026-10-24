
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  ShoppingCart: () => <div data-testid="icon-shopping-cart" />,
  Plus: () => <div data-testid="icon-plus" />,
  Minus: () => <div data-testid="icon-minus" />,
  X: () => <div data-testid="icon-x" />,
  ChefHat: () => <div data-testid="icon-chef-hat" />,
  Receipt: () => <div data-testid="icon-receipt" />,
  Menu: () => <div data-testid="icon-menu" />,
  QrCode: () => <div data-testid="icon-qrcode" />,
  LogOut: () => <div data-testid="icon-logout" />,
  BarChart3: () => <div data-testid="icon-barchart" />,
  Utensils: () => <div data-testid="icon-utensils" />,
  Users: () => <div data-testid="icon-users" />,
  LogIn: () => <div data-testid="icon-login" />,
  Lock: () => <div data-testid="icon-lock" />,
  User: () => <div data-testid="icon-user" />,
  AlertCircle: () => <div data-testid="icon-alert-circle" />,
  Smartphone: () => <div data-testid="icon-smartphone" />,
  Eye: () => <div data-testid="icon-eye" />,
  EyeOff: () => <div data-testid="icon-eye-off" />,
  Mic: () => <div data-testid="icon-mic" />,
  MicOff: () => <div data-testid="icon-mic-off" />,
  Volume2: () => <div data-testid="icon-volume2" />,
  CheckCircle: () => <div data-testid="icon-check-circle" />,
  Package: () => <div data-testid="icon-package" />,
  Clock: () => <div data-testid="icon-clock" />
}));

// Mock API
jest.mock('./services/api', () => ({
  getPlatillos: jest.fn(() => Promise.resolve([])),
  getPedidos: jest.fn(() => Promise.resolve([])),
  login: jest.fn(() => Promise.resolve({ token: 'fake-token', usuario: { nombre: 'Test', rol: 'Administrador' } })),
}));

// Mock AuthContext
jest.mock('./context/AuthContext', () => {
  const React = require('react');
  return {
    AuthProvider: ({ children }) => <div>{children}</div>,
    useAuth: () => ({
      usuario: null,
      esClienteQR: false,
      estaAutenticado: false,
      logout: jest.fn(),
      cargando: false
    })
  };
});

// Mock VoiceControlCocina because SpeechRecognition is not available in JSDOM
jest.mock('./components/VoiceControlCocina', () => {
  return function DummyVoiceControl() {
    return <div data-testid="voice-control-mock" />;
  };
});

// Mock window.scrollTo
window.scrollTo = jest.fn();

test('renders app without crashing', () => {
  render(<App />);
  // Depending on the state (unauthenticated), it should render the login or menu
  // Since we mocked useAuth to return null user, it should render Login
  const loginButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
  expect(loginButton).toBeInTheDocument();
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
