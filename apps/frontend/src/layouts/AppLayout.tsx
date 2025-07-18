import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import appStateStore from '../store';

export const AppLayout = () => {
  const { getCurrentUser } = appStateStore(state => state);

  useEffect(() => {
    getCurrentUser();
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
