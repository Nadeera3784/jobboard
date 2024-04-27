export type AppContextType = {
  permission: string;
  user: string;
  setToken: (token: string) => void;
  setUser: (user: string) => void;
  setPermission: (permission: string) => void;
};
