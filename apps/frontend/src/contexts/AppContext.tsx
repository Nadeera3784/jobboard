import { createContext, useContext, useEffect, useState } from 'react';

import { AppContextType, ProviderType } from '../types';
import { cacheJwtToken } from '../utils';

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider = ({ children }: ProviderType) => {
  const [permission, setPermission] = useState('');
  const [user, setUser] = useState('');
  const [token, setToken] = useState('');

  const updateToken = (newToken: string) => {
    setToken(newToken);
  };

  const updateUser = (newUser: string) => {
    setUser(newUser);
  };

  const updatePermission = (permission: string) => {
    setPermission(permission);
  };

  useEffect(() => {
    if (token) {
      cacheJwtToken(token);
    }
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        permission,
        user,
        setToken: updateToken,
        setUser: updateUser,
        setPermission: updatePermission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
