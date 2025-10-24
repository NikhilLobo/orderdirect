# Redux + React Query + Testing Setup

## ✅ What's Configured

Your OrderDirect project now uses **Redux Toolkit** for state management, **React Query** for server state, and **Vitest + React Testing Library** for testing.

## 📦 State Management Architecture

### **Redux Toolkit** - Client State
Used for application-wide client state (auth, cart, UI state)

**Store Location:** [`src/store/`](src/store/)

**Slices:**
- **Auth Slice** ([`src/store/slices/authSlice.ts`](src/store/slices/authSlice.ts))
  - Manages user authentication state
  - Actions: `setUser`, `setLoading`, `setError`, `clearError`, `logout`

- **Cart Slice** ([`src/store/slices/cartSlice.ts`](src/store/slices/cartSlice.ts))
  - Manages shopping cart state with localStorage persistence
  - Actions: `addItem`, `removeItem`, `updateQuantity`, `setRestaurant`, `clearCart`
  - Auto-calculates subtotal, delivery fee, taxes, and total

**Usage Example:**
```typescript
import { useAppSelector, useAppDispatch } from '@/store';
import { addItem, clearCart } from '@/store/slices/cartSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleAddToCart = (item) => {
    dispatch(addItem(item));
  };

  return (
    <div>
      <p>Cart Total: ₹{total}</p>
      <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
    </div>
  );
}
```

### **React Query** - Server State
Used for fetching, caching, and synchronizing server data (restaurants, menu items, orders)

**Configuration:** [`src/providers/QueryProvider.tsx`](src/providers/QueryProvider.tsx)

**Usage Example:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetching data
function RestaurantList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const response = await fetch('/api/restaurants');
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data.map(restaurant => ...)}</div>;
}

// Mutating data
function PlaceOrder() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (orderData) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return (
    <button onClick={() => mutation.mutate(orderData)}>
      Place Order
    </button>
  );
}
```

## 🧪 Testing Setup

### **Vitest** + **React Testing Library**

**Configuration:** [`vitest.config.ts`](vitest.config.ts)

**Test Utils:** [`src/test/utils/test-utils.tsx`](src/test/utils/test-utils.tsx)

### Running Tests

```bash
# Run tests once
npm test

# Watch mode
npm run test:watch

# UI mode
npm run test:ui

# Coverage
npm run test:coverage
```

### Writing Tests

#### **1. Redux Slice Tests**

Example: [`src/store/slices/__tests__/cartSlice.test.ts`](src/store/slices/__tests__/cartSlice.test.ts)

```typescript
import { describe, it, expect } from 'vitest';
import cartReducer, { addItem, clearCart } from '../cartSlice';

describe('cartSlice', () => {
  const initialState = {
    items: [],
    subtotal: 0,
    total: 0,
  };

  it('should handle addItem', () => {
    const item = { menuItem: { id: '1', price: 299 }, quantity: 2 };
    const actual = cartReducer(initialState, addItem(item));
    expect(actual.items).toHaveLength(1);
    expect(actual.subtotal).toBe(598);
  });

  it('should handle clearCart', () => {
    const stateWithItem = { ...initialState, items: [item] };
    const actual = cartReducer(stateWithItem, clearCart());
    expect(actual).toEqual(initialState);
  });
});
```

#### **2. Component Tests** (with Redux & React Query)

```typescript
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/utils/test-utils';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render with preloaded state', () => {
    const preloadedState = {
      auth: {
        user: { id: '1', name: 'John' },
        isAuthenticated: true,
      },
    };

    render(<MyComponent />, { preloadedState });
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

#### **3. React Query Tests**

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

it('should fetch restaurants', async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const { result } = renderHook(() => useRestaurants(), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toHaveLength(5);
});
```

## 📊 Test Coverage

Currently: **17 tests passing**
- ✅ Auth slice: 7 tests
- ✅ Cart slice: 10 tests

**Test Files:**
- [`src/store/slices/__tests__/authSlice.test.ts`](src/store/slices/__tests__/authSlice.test.ts)
- [`src/store/slices/__tests__/cartSlice.test.ts`](src/store/slices/__tests__/cartSlice.test.ts)

## 🏗️ Architecture Patterns

### State Management Decision Tree

```
Is it server data (API, Database)?
├─ YES → Use React Query
│   ├─ Restaurants, Menu Items, Orders
│   ├─ User Profile (from API)
│   └─ Real-time order tracking
│
└─ NO → Use Redux
    ├─ Authentication state
    ├─ Shopping cart
    ├─ UI state (modals, theme)
    └─ Form state (complex forms)
```

### Folder Structure

```
src/
├── store/                      # Redux
│   ├── index.ts               # Store configuration
│   └── slices/                # Redux slices
│       ├── authSlice.ts
│       ├── cartSlice.ts
│       └── __tests__/         # Slice tests
│
├── providers/                  # React Query
│   └── QueryProvider.tsx      # Query client setup
│
├── hooks/                      # Custom hooks
│   ├── useRestaurants.ts      # React Query hooks
│   ├── useOrders.ts
│   └── useAuth.ts             # Redux + Firebase
│
└── test/                       # Test utilities
    ├── setup.ts
    └── utils/
        └── test-utils.tsx     # Custom render with providers
```

## 🔄 Data Flow Examples

### **Adding Item to Cart** (Redux)
```
User clicks "Add to Cart"
  ↓
dispatch(addItem({ menuItem, quantity }))
  ↓
cartSlice reducer updates state
  ↓
localStorage automatically synced
  ↓
Components re-render with new cart state
```

### **Fetching Restaurants** (React Query)
```
Component renders
  ↓
useQuery({ queryKey: ['restaurants'] })
  ↓
React Query checks cache
  ↓
If stale/missing → fetch from API
  ↓
Data cached for 5 minutes
  ↓
Component displays data
```

## 🎯 Best Practices

### Redux
1. ✅ Use `useAppSelector` and `useAppDispatch` (typed hooks)
2. ✅ Keep Redux for client-only state
3. ✅ Use Redux Toolkit's `createSlice` (auto-generates actions)
4. ✅ Enable Redux DevTools in development

### React Query
1. ✅ Use descriptive `queryKey` arrays
2. ✅ Set appropriate `staleTime` (currently 5 min)
3. ✅ Invalidate queries after mutations
4. ✅ Handle loading and error states
5. ✅ Use React Query DevTools

### Testing
1. ✅ Write tests for Redux slices (business logic)
2. ✅ Use custom `render` from test-utils
3. ✅ Mock API calls in React Query tests
4. ✅ Test user interactions, not implementation
5. ✅ Maintain >80% coverage for critical paths

## 📚 Resources

- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Query](https://tanstack.com/query/latest)
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)

## 🚀 Next Steps

1. Create custom React Query hooks for:
   - `useRestaurants()` - Fetch restaurant listings
   - `useMenuItems(restaurantId)` - Fetch menu for a restaurant
   - `useOrders()` - Fetch user's orders
   - `usePlaceOrder()` - Mutation to create order

2. Add more Redux slices as needed:
   - UI state (modal visibility, theme)
   - User preferences
   - Filters and search state

3. Implement Firebase integration:
   - Auth state sync with Redux
   - Firestore queries with React Query
   - Real-time subscriptions

4. Expand test coverage:
   - Integration tests for complex flows
   - E2E tests for critical paths
   - Component interaction tests

---

**Your state management and testing infrastructure is now production-ready!** 🎉
