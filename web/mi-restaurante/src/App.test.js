import { render, act } from '@testing-library/react';
import App from './App';
import * as api from './services/api';

// Mock dependencies
jest.mock('./services/api');
jest.mock('./components/Login', () => () => <div>Login Mock</div>);
jest.mock('./components/ProtectedRoute', () => ({ children }) => <div>{children}</div>);
jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    usuario: { rol: 'cocina', nombre: 'Chef' },
    esClienteQR: false,
    estaAutenticado: true,
    logout: jest.fn(),
    cargando: false
  })
}));
// Mock Chart.js used in Reportes to avoid canvas errors if rendered
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  // ... other mocks if needed
}));

// Mock window.location
const originalLocation = window.location;

describe('App Polling Optimization', () => {
  beforeAll(() => {
    delete window.location;
    window.location = {
      pathname: '/cocina',
      search: '',
    };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    // Default mocks
    api.getPlatillos.mockResolvedValue([]);
    api.getPedidos.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('reproduces stale closure issue', async () => {
    // Setup initial data
    const mockPedido = {
      id: 1,
      mesaNumero: 5,
      detalles: [{ id: 1, platilloNombre: 'Burger', cantidad: 1, nota: '' }],
      fecha: new Date().toISOString(),
      estado: 'EnProceso'
    };

    // api.getPedidos returns the same data always
    api.getPedidos.mockResolvedValue([mockPedido]);

    // Spy on console.log to detect "Nuevos pedidos detectados"
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await act(async () => {
      render(<App />);
    });

    // Initial load
    expect(api.getPedidos).toHaveBeenCalledTimes(1);

    // Fast-forward time by 2 seconds
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Should have called again
    expect(api.getPedidos).toHaveBeenCalledTimes(2);

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Check logs
    const newOrdersLogs = logSpy.mock.calls.filter(args => args[0] === '🔔 Nuevos pedidos detectados:');

    // Expectation for FIXED behavior:
    // Initial load: 1 log (correct, finding 1 new order)
    // First tick: 0 logs (idsAnteriores populated correctly via ref, so no new orders)
    // Second tick: 0 logs
    // Total 1 log.

    console.info('Number of "Nuevos pedidos detectados" logs:', newOrdersLogs.length);

    // Assert that the bug is FIXED
    expect(newOrdersLogs.length).toBe(1);

    logSpy.mockRestore();
  });
});
