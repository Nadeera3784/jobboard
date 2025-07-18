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
    const response = await httpClient.get('authentication/me');
    set({ user: response.data.data });
  },
});

const appStateStore = create(stateStore);

export default appStateStore;
