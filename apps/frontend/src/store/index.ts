import { create } from 'zustand';
import { User } from '../types';
import { Intercom } from '../utils';

interface StateStore {
  user: User | null;
  setCurrentUser: (payload: User) => void;
  getCurrentUser: () => Promise<void>;
}

type SetFunction = (
  partial:
    | StateStore
    | Partial<StateStore>
    | ((state: StateStore) => StateStore | Partial<StateStore>),
  replace?: boolean | undefined,
) => void;

const stateStore = (set: SetFunction): StateStore => ({
  user: null,
  setCurrentUser: (payload: User) => {
    set(() => ({ user: payload }));
  },
  getCurrentUser: async () => {
    try {
      const response = await Intercom.get('authentication/me');
      set({ user: response.data.data });
    } catch (error) {
      console.error('Failed to get current user:', error);
      set({ user: null });
    }
  },
});

const appStateStore = create<StateStore>(stateStore);

export default appStateStore;
