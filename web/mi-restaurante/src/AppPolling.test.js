import React from 'react';
import { render, act } from '@testing-library/react';
import App from './App';
import * as api from './services/api';
import Cocina from './Cocina';

// Mock dependencies
jest.mock('./services/api');
jest.mock('./Cocina', () => jest.fn(() => <div data-testid="cocina-view">Cocina View</div>));
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
}));
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: () => null,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

// Mock fetch for any internal calls not covered by api mock
global.fetch = jest.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({})
}));

describe('App Polling Performance', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    // Setup API mock response
    // Return a NEW object every time to simulate network response parsing
    api.getPedidos.mockImplementation(async () => {
        return [
            {
                id: 1,
                mesaNumero: 5,
                estado: 'EnProceso',
                fecha: '2023-10-27T10:00:00Z',
                detalles: [
                { id: 101, platilloNombre: 'Burger', cantidad: 2, nota: '' }
                ]
            }
        ];
    });

    api.getPlatillos.mockResolvedValue([]);

    // Setup URL for public kitchen view
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/cocina',
        search: '',
        assign: jest.fn(),
      },
      writable: true
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('re-renders Cocina excessively when data is identical', async () => {
    await act(async () => {
      render(<App />);
    });

    // Initial render
    expect(Cocina).toHaveBeenCalled();
    const initialCalls = Cocina.mock.calls.length;
    console.log('Initial Cocina renders:', initialCalls);

    // Fast forward time to trigger polling (2s interval)
    // Run for 10 seconds -> 5 calls
    for (let i = 0; i < 5; i++) {
        await act(async () => {
            jest.advanceTimersByTime(2000);
        });
    }

    // We expect API to be called
    expect(api.getPedidos).toHaveBeenCalledTimes(1 + 5); // Initial + 5 intervals

    console.log(`Cocina rendered total: ${Cocina.mock.calls.length}`);

    // Without optimization, setPedidos is called every time because the transformed data
    // is a new array/object reference, causing a re-render.
    // If optimization works, this should be close to initialCalls (maybe +1).
    // If not, it will be >= initialCalls + 5.

    // With optimization, setPedidos is only called if data changed.
    // Data is identical in this test, so it should NOT re-render after initial load.

    // We assert that it does NOT re-render significantly
    expect(Cocina.mock.calls.length).toBeLessThan(initialCalls + 2);
  });
});
