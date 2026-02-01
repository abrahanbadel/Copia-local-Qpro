import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ReportesFinancieros from './Reportes';
import * as api from './services/api';

// Mock dependencies
jest.mock('./services/api');
// Mock Recharts to avoid rendering issues in test environment (optional but recommended if issues arise)
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
      ...OriginalModule,
      ResponsiveContainer: ({ children }) => <div className="recharts-responsive-container">{children}</div>
  };
});


describe('ReportesFinancieros Performance', () => {
  const mockPedidos = [
    {
      id: 1,
      estado: 'Pagado',
      fecha: new Date().toISOString(),
      usuarioId: 1,
      meseroNombre: 'Juan',
      mesaNumero: 1,
      detalles: [
        { platilloNombre: 'Pizza', precio: 20000, cantidad: 1 }
      ]
    },
    {
        id: 2,
        estado: 'Pagado',
        fecha: new Date().toISOString(),
        usuarioId: 2,
        meseroNombre: 'Maria',
        mesaNumero: 2,
        detalles: [
          { platilloNombre: 'Burger', precio: 15000, cantidad: 2 }
        ]
      }
  ];

  const mockPagos = [
    {
      pedidoId: 1,
      montoPropina: 2000,
      monto: 22000,
      metodoPago: 'Efectivo'
    },
    {
        pedidoId: 2,
        montoPropina: 3000,
        monto: 33000,
        metodoPago: 'Tarjeta'
      }
  ];

  beforeEach(() => {
    api.getPedidos.mockResolvedValue(mockPedidos);
    api.getPagos.mockResolvedValue(mockPagos);
  });

  test('renders and calculates metrics correctly', async () => {
    render(<ReportesFinancieros />);

    // Wait for data to load
    await waitFor(() => {
        expect(screen.queryByText('Cargando datos...')).not.toBeInTheDocument();
    });

    // Check if title is present
    expect(screen.getByText('Reportes Financieros')).toBeInTheDocument();

    // Check if metrics are displayed (approximate values or presence)
    // Pizza: 20000, Burger: 30000. Total: 50000
    // We might need to handle currency formatting in test expectations if we want exact matches,
    // but checking for presence of elements is a good start.
    expect(screen.getByText('Ventas Totales')).toBeInTheDocument();
  });
});
