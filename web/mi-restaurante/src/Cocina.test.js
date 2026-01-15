import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cocina from './Cocina';

// Mock dependencies
jest.mock('./services/api', () => ({
  actualizarEstadoPedido: jest.fn(() => Promise.resolve()),
}));

jest.mock('./components/VoiceControlCocina', () => {
  return function DummyVoiceControl() {
    return <div data-testid="voice-control">Voice Control</div>;
  };
});

// Mock AuthContext
const mockUseAuth = jest.fn();
jest.mock('./context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('Cocina Component', () => {
  const mockPedidos = [
    {
      id: 1,
      mesa: 1,
      estado: 'EnProceso',
      hora: new Date(),
      items: [{ nombre: 'Pizza', cantidad: 1 }]
    }
  ];

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      usuario: { nombre: 'Test Chef', rol: 'Administrador' }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders orders correctly', () => {
    render(<Cocina pedidos={mockPedidos} />);
    expect(screen.getByText('Orden #1')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
  });

  test('handles interaction without crashing', async () => {
     render(<Cocina pedidos={mockPedidos} />);
     const botonListo = screen.getByText('Marcar Listo');
     fireEvent.click(botonListo);
     expect(await screen.findByText('¿Marcar como Listo?')).toBeInTheDocument();
  });
});
