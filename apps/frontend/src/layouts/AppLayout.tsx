import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import appStateStore from '../store';
import { getJWTToken } from '../utils';

export const AppLayout = () => {
  const { getCurrentUser } = appStateStore(state => state);

  useEffect(() => {
    // Only fetch user data if there's a JWT token (user is logged in)
    const token = getJWTToken();
    if (token) {
      getCurrentUser();
    }
  }, []);

  return (
    <div className="flex flex-col mx-auto w-full min-h-screen bg-gray-100">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
