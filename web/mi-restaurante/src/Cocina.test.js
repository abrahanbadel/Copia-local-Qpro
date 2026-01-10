import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Cocina from './Cocina';
import { AuthProvider } from './context/AuthContext';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Users: () => <span data-testid="icon-users" />, // Use span instead of div
  ChefHat: () => <span data-testid="icon-chef-hat" />,
  Clock: () => <span data-testid="icon-clock" />,
  CheckCircle: () => <span data-testid="icon-check-circle" />,
  Package: () => <span data-testid="icon-package" />,
  Mic: () => <span data-testid="icon-mic" />,
  MicOff: () => <span data-testid="icon-mic-off" />,
  AlertCircle: () => <span data-testid="icon-alert-circle" />,
}));

// Mock API
jest.mock('./services/api', () => ({
  actualizarEstadoPedido: jest.fn(),
}));

// Mock VoiceControlCocina
jest.mock('./components/VoiceControlCocina', () => {
  return function DummyVoiceControl(props) {
    return <div data-testid="voice-control">Voice Control</div>;
  };
});

const mockPedidos = [
  {
    id: 1,
    mesa: 5,
    hora: new Date('2024-01-01T12:00:00'),
    estado: 'EnProceso',
    items: [
      { nombre: 'Pizza', cantidad: 1, notas: 'Sin cebolla' }
    ]
  },
  {
    id: 2,
    mesa: 3,
    hora: new Date('2024-01-01T12:05:00'),
    estado: 'Listo',
    items: [
      { nombre: 'Pasta', cantidad: 2 }
    ]
  }
];

describe('Cocina Component', () => {
  test('renders orders correctly', () => {
    render(
      <AuthProvider>
        <Cocina pedidos={mockPedidos} />
      </AuthProvider>
    );

    expect(screen.getByText('Orden #1')).toBeInTheDocument();
    expect(screen.getByText('Orden #2')).toBeInTheDocument();
    expect(screen.getByText('Mesa 5')).toBeInTheDocument();
    expect(screen.getByText('Mesa 3')).toBeInTheDocument();
  });
});
