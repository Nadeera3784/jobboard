import { create } from 'zustand';
import { httpClient } from '../utils';
import { User } from '../types';

const stateStore = set => ({
  user: null,
  setCurrentUser: (payload: User) => {
    set(state => ({ user: payload }));
  },
  getCurrentUser: async () => {
    const response = await httpClient.get('authentication/me');
    set({ user: response.data.data });
  },
});

const appStateStore = create(stateStore);

export default appStateStore;
