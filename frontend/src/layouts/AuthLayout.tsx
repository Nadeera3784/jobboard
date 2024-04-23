import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="flex flex-col mx-auto w-full min-h-screen bg-gray-100">
      <main className="flex flex-auto flex-col max-w-full">
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden max-w-10xl mx-auto p-4 lg:p-8 w-full">
          <div className="pattern-dots-md text-gray-300 absolute top-0 right-0 w-32 h-32 lg:w-48 lg:h-48 transform translate-x-16 translate-y-16" />
          <div className="pattern-dots-md text-gray-300 absolute bottom-0 left-0 w-32 h-32 lg:w-48 lg:h-48 transform -translate-x-16 -translate-y-16" />
          <Outlet />
        </div>
      </main>
    </div>
  );
};
