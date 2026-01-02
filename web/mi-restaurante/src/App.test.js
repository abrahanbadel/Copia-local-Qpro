
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
});
