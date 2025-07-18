import { create } from 'zustand';
import { httpClient } from '../utils';
import { User } from '../types';

interface StateStore {
  user: User | null;
  setCurrentUser: (payload: User) => void;
  getCurrentUser: () => Promise<void>;
}

const stateStore = (set: any): StateStore => ({
  user: null,
  setCurrentUser: (payload: User) => {
    set((state: any) => ({ user: payload }));
  },
  getCurrentUser: async () => {
    try {
      const response = await httpClient.get('authentication/me');
      set({ user: response.data.data });
    } catch (error) {
      // Silently handle errors - user might not be logged in
      // The HTTP interceptor will handle redirects if needed
      set({ user: null });
    }
  },
});

const appStateStore = create(stateStore);

export default appStateStore;
