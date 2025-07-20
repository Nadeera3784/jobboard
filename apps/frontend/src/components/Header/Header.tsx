import { Link } from 'react-router-dom';

import appStateStore from '../../store';
import Logo from '../../assets/images/logo.png';

export const Header = () => {
  const { user } = appStateStore(state => state);

  return (
    <div className="relative bg-gray-50 overflow-hidden">
      <div className="relative pt-6 pb-16 sm:pb-24">
        <div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav
              className="relative flex items-center justify-between sm:h-10 md:justify-center"
              aria-label="Global"
            >
              <div className="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
                <div className="flex items-center justify-between w-full md:w-auto">
                  <Link to="/">
                    <span className="sr-only">Workflow</span>
                    <img
                      className="inline-block w-10 h-10  sm:h-10"
                      src={Logo}
                    />
                    <span className="text-2xl">JobBoard</span>
                  </Link>
                  <div className="-mr-2 flex items-center md:hidden">
                    <button
                      type="button"
                      className="bg-gray-50 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                      aria-expanded="false"
                    >
                      <span className="sr-only">Open main menu</span>
                      {/* Heroicon name: outline/menu */}
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex md:space-x-10">
                <Link
                  to="/"
                  className="font-medium text-gray-500 hover:text-gray-900"
                >
                  Home
                </Link>
                <Link
                  to="/search"
                  className="font-medium text-gray-500 hover:text-gray-900"
                >
                  Explore
                </Link>
                <a
                  href="#"
                  className="font-medium text-gray-500 hover:text-gray-900"
                >
                  Blog
                </a>
              </div>
              <div className="hidden md:absolute md:flex md:items-center md:justify-end md:inset-y-0 md:right-0">
                <span className="inline-flex rounded-md shadow">
                  <>
                    {user?.name ? (
                      <Link to={'/' + user?.role}>
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-gray-300">
                          <svg
                            className="hi-solid hi-user inline-block w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        to="/auth"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-50"
                      >
                        Log in
                      </Link>
                    )}
                  </>
                </span>
              </div>
            </nav>
          </div>
          <div className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
            <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
              <div className="px-5 pt-4 flex items-center justify-between">
                <div>
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt=""
                  />
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  >
                    <span className="sr-only">Close menu</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="px-2 pt-2 pb-3">
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Product
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Marketplace
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Company
                </a>
              </div>

              <Link
                to="/auth"
                className="block w-full px-5 py-3 text-center font-medium text-black bg-black hover:bg-gray-100"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
