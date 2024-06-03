import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';

export const AppLayout = () => {
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
