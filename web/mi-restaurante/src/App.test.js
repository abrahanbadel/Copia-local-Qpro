import { render, screen, act, waitFor } from '@testing-library/react';
import App from './App';
import * as api from './services/api';

// Mock the api service
jest.mock('./services/api');

// Mock VoiceControlCocina because SpeechRecognition is not available in JSDOM
jest.mock('./components/VoiceControlCocina', () => {
  return function DummyVoiceControl() {
    return <div data-testid="voice-control">Voice Control Mock</div>;
  };
});

// Mock window.location
const originalLocation = window.location;

beforeAll(() => {
  delete window.location;
  window.location = { ...originalLocation, search: '', pathname: '/' };
});

afterAll(() => {
  window.location = originalLocation;
});

beforeEach(() => {
  jest.clearAllMocks();
});

test('polls active orders with filter when in kitchen view', async () => {
  // Setup mocks
  api.getPedidos.mockResolvedValue([]);
  api.getPlatillos.mockResolvedValue([]);
  api.getMesas.mockResolvedValue([]);

  // Simulate Kitchen view
  window.location.pathname = '/cocina';
  window.location.search = '';

  await act(async () => {
    render(<App />);
  });

  // Wait for effects to run
  await waitFor(() => {
    // Verify getPedidos was called
    expect(api.getPedidos).toHaveBeenCalled();
  });

  // Check if it was called with the correct filter
  expect(api.getPedidos).toHaveBeenCalledWith({ activos: true });
});
