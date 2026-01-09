import React from 'react';
import { render, screen } from '@testing-library/react';
import Facturacion from './Facturacion';

// Mock API
jest.mock('./services/api', () => ({
  getPedidos: jest.fn(() => Promise.resolve([])),
  getPagos: jest.fn(() => Promise.resolve([])),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Search: () => <span>Search</span>,
  FileText: () => <span>FileText</span>,
  Calendar: () => <span>Calendar</span>,
  DollarSign: () => <span>DollarSign</span>,
  Download: () => <span>Download</span>,
  Receipt: () => <span>Receipt</span>,
  ChevronDown: () => <span>ChevronDown</span>,
  ChevronUp: () => <span>ChevronUp</span>,
  Printer: () => <span>Printer</span>,
  Check: () => <span>Check</span>,
  X: () => <span>X</span>,
  CheckCircle: () => <span>CheckCircle</span>,
  AlertCircle: () => <span>AlertCircle</span>,
  Users: () => <span>Users</span>,
}));

test('renders Facturacion component without crashing', async () => {
  render(<Facturacion />);
  expect(await screen.findByText('Sistema de Facturacion')).toBeInTheDocument();
});
