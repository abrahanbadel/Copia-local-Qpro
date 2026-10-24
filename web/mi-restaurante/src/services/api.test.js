
import * as api from './api';

describe('api service', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('getPedidos calls correct URL without parameters', async () => {
    await api.getPedidos();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/pedidos$/),
      expect.any(Object)
    );
  });

  test('getPedidos calls correct URL with activos=true', async () => {
    await api.getPedidos(true);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/pedidos\?activos=true$/),
      expect.any(Object)
    );
  });
});
