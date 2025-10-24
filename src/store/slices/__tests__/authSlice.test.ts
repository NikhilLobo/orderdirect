import { describe, it, expect } from 'vitest';
import authReducer, { setUser, setLoading, setError, clearError, logout } from '../authSlice';
import type { User } from '../../../types';

describe('authSlice', () => {
  const initialState = {
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  };

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setUser', () => {
    const actual = authReducer(initialState, setUser(mockUser));
    expect(actual.user).toEqual(mockUser);
    expect(actual.isAuthenticated).toBe(true);
    expect(actual.isLoading).toBe(false);
    expect(actual.error).toBe(null);
  });

  it('should handle setUser with null (logout)', () => {
    const stateWithUser = authReducer(initialState, setUser(mockUser));
    const actual = authReducer(stateWithUser, setUser(null));
    expect(actual.user).toBe(null);
    expect(actual.isAuthenticated).toBe(false);
  });

  it('should handle setLoading', () => {
    const actual = authReducer(initialState, setLoading(false));
    expect(actual.isLoading).toBe(false);
  });

  it('should handle setError', () => {
    const actual = authReducer(initialState, setError('Something went wrong'));
    expect(actual.error).toBe('Something went wrong');
    expect(actual.isLoading).toBe(false);
  });

  it('should handle clearError', () => {
    const stateWithError = authReducer(initialState, setError('Error'));
    const actual = authReducer(stateWithError, clearError());
    expect(actual.error).toBe(null);
  });

  it('should handle logout', () => {
    const stateWithUser = authReducer(initialState, setUser(mockUser));
    const actual = authReducer(stateWithUser, logout());
    expect(actual.user).toBe(null);
    expect(actual.isAuthenticated).toBe(false);
    expect(actual.isLoading).toBe(false);
    expect(actual.error).toBe(null);
  });
});
