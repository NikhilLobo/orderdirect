import type { JSX } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { QueryProvider } from '../../providers/QueryProvider';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/slices/authSlice';
import cartReducer from '../../store/slices/cartSlice';
import type { RootState } from '../../store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof configureStore>;
}

export function renderWithProviders(
  ui: JSX.Element,
  {
    preloadedState,
    store = configureStore({
      reducer: {
        auth: authReducer,
        cart: cartReducer,
      },
      preloadedState: preloadedState as any,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <QueryProvider>
          <MemoryRouter>{children}</MemoryRouter>
        </QueryProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react';
export { renderWithProviders as render };
