import { render, screen, waitFor, act } from '@testing-library/react';
import App from './App';
import * as api from './services/api';
import { useAuth } from './context/AuthContext';

// Mock the API module
jest.mock('./services/api');

// Mock AuthContext
jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: jest.fn()
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    pathname: '/cocina',
    search: '',
    assign: jest.fn(),
    reload: jest.fn(),
  },
  writable: true
});

describe('App Polling Optimization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Default auth mock
    useAuth.mockReturnValue({
      usuario: { nombre: 'Chef', rol: 'Cocina' },
      esClienteQR: false,
      estaAutenticado: true,
      logout: jest.fn(),
      cargando: false
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('calls getPedidos periodically in kitchen view', async () => {
    const mockPlatillos = [];
    const mockPedidos = [
      {
        id: 1,
        mesaNumero: 5,
        estado: 'EnProceso',
        fecha: new Date().toISOString(),
        detalles: [
          { id: 101, platilloNombre: 'Pizza', cantidad: 1, nota: '' }
        ]
      }
    ];

    api.getPlatillos.mockResolvedValue(mockPlatillos);
    api.getPedidos.mockResolvedValue(mockPedidos);

    await act(async () => {
      render(<App />);
    });

    // Check if getPedidos was called initially
    expect(api.getPedidos).toHaveBeenCalled();

    // Fast-forward time by 2 seconds
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Check if getPedidos was called again
    expect(api.getPedidos).toHaveBeenCalledTimes(2);
  });
});
