import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import appStateStore from '../store';
import { deleteJWTToken } from '../utils';

export const CompanyLayout = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { getCurrentUser, user } = appStateStore(state => state);

  const onClickDropDownToggle = function () {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const onClickDesktopSidebarToggle = function () {
    setDesktopSidebarOpen(!desktopSidebarOpen);
    setMobileSidebarOpen(!desktopSidebarOpen);
  };

  const onClickMobileSidebarToggle = function () {
    setMobileSidebarOpen(!mobileSidebarOpen);
    setDesktopSidebarOpen(!mobileSidebarOpen);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const onClickSignOut = () => {
    deleteJWTToken();
    navigate('/auth');
  };

  return (
    <>
      <div
        className={`flex flex-col mx-auto w-full min-h-screen bg-gray-100 ${desktopSidebarOpen || mobileSidebarOpen ? (desktopSidebarOpen ? 'lg:pl-64' : 'pl-64') : ''}`}
      >
        <nav
          className={`flex flex-col fixed top-0 left-0 bottom-0 w-full lg:w-64 h-full bg-white border-r border-gray-200 z-50 transform transition-transform duration-500 ease-out ${desktopSidebarOpen || mobileSidebarOpen ? 'translate-x-0' : desktopSidebarOpen ? 'lg:-translate-x-full' : '-translate-x-full'}`}
          aria-label="Main Sidebar Navigation"
        >
          <div className="h-16 flex-none flex items-center justify-between lg:justify-center px-4 w-full">
            <a
              href=""
              className="inline-flex items-center space-x-2 font-bold text-lg tracking-wide text-primary hover:text-gray-500"
            >
              <svg
                className="hi-solid hi-cube-transparent inline-block w-6 h-6 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z"
                  clipRule="evenodd"
                />
              </svg>
              <span>JobBoard</span>
            </a>
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => onClickMobileSidebarToggle()}
                className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-transparent text-red-600 hover:text-red-400 focus:ring focus:ring-red-500 focus:ring-opacity-50 active:text-red-600"
              >
                <svg
                  className="hi-solid hi-x inline-block w-4 h-4 -mx-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="overflow-y-auto">
            <div className="p-4 w-full">
              <nav className="space-y-1">
                <div className="px-3 pt-5 pb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Manage
                </div>
                <Link
                  to="/company"
                  className={`flex items-center space-x-3 px-3 font-medium rounded text-gray-600 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-50`}
                >
                  <span className="flex-none flex items-center">
                    <svg
                      className="hi-outline hi-view-grid inline-block w-5 h-5"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </span>
                  <span className="py-2 flex-grow">Dashboard</span>
                </Link>
                <Link
                  to="/company/jobs"
                  className={`flex items-center space-x-3 px-3 font-medium rounded text-gray-600 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-50`}
                >
                  <span className="flex-none flex items-center">
                    <svg
                      className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 h-6 w-6"
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
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <span className="py-2 flex-grow">Jobs</span>
                </Link>


                <div className="px-3 pt-5 pb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Account
                </div>
                <Link
                  to="/company/settings"
                  className="flex items-center space-x-3 px-3 font-medium rounded text-gray-600 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-50"
                >
                  <span className="flex-none flex items-center opacity-50">
                    <svg
                      className="hi-outline hi-cog inline-block w-5 h-5"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </span>
                  <span className="py-2 grow">Settings</span>
                </Link>
                <button
                  type="button"
                  onClick={onClickSignOut}
                  className="flex items-center space-x-3 px-3 font-medium rounded text-gray-600 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-50"
                >
                  <span className="flex-none flex items-center opacity-50">
                    <svg
                      className="hi-outline hi-lock-open inline-block w-5 h-5"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <span className="py-2 grow">Log out</span>
                </button>
              </nav>
            </div>
          </div>
        </nav>

        <header
          className={`flex flex-none items-center h-16 bg-white shadow-sm fixed top-0 right-0 left-0 z-30 ${desktopSidebarOpen || mobileSidebarOpen ? (desktopSidebarOpen ? 'lg:pl-64' : 'pl-64') : ''}`}
        >
          <div className="flex justify-between max-w-10xl mx-auto px-4 lg:px-8 w-full">
            <div className="flex items-center space-x-2">
              <div className="hidden lg:block">
                <button
                  type="button"
                  onClick={() => onClickDesktopSidebarToggle()}
                  className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-6 rounded border-gray-300 bg-white text-gray-800 shadow-sm hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:shadow  focus:ring-opacity-25 active:bg-white active:border-white active:shadow-none"
                >
                  <svg
                    className="hi-solid hi-menu-alt-1 inline-block w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="lg:hidden">
                <button
                  type="button"
                  onClick={() => onClickMobileSidebarToggle()}
                  className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-6 rounded border-gray-300 bg-white text-gray-800 shadow-sm hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:shadow  focus:ring-opacity-25 active:bg-white active:border-white active:shadow-none"
                >
                  <svg
                    className="hi-solid hi-menu-alt-1 inline-block w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative inline-block">
                <button
                  onClick={() => onClickDropDownToggle()}
                  type="button"
                  className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-gray-300 bg-white text-gray-800 shadow-sm hover:text-gray-800 hover:bg-gray-100 hover:border-gray-300 hover:shadow  focus:ring-opacity-25 active:bg-white active:border-white active:shadow-none"
                  id="tk-dropdown-layouts-user"
                  aria-haspopup="true"
                  aria-expanded="true"
                >
                  <span>{user?.name}</span>
                  <svg
                    className="hi-solid hi-chevron-down inline-block w-5 h-5 opacity-50"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  role="menu"
                  aria-labelledby="tk-dropdown-layouts-user"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                  className={`absolute right-0 origin-top-right mt-2 w-48 shadow-xl rounded z-1  ${userDropdownOpen ? '' : 'hidden'}`}
                >
                  <div className="bg-white ring-1 ring-black ring-opacity-5 rounded divide-y divide-gray-100">
                    <div className="p-2 space-y-1">
                      <Link
                        to="/company/settings"
                        role="menuitem"
                        className="flex items-center space-x-2 rounded py-2 px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:bg-gray-100 focus:text-gray-700"
                      >
                        <svg
                          className="hi-solid hi-cog inline-block w-5 h-5 opacity-50"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Settings</span>
                      </Link>
                    </div>
                    <div className="p-2 space-y-1">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={onClickSignOut}
                        className="w-full text-left flex items-center space-x-2 rounded py-2 px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:bg-gray-100 focus:text-gray-700"
                      >
                        <svg
                          className="hi-solid hi-lock-closed inline-block w-5 h-5 opacity-50"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* END Page Header */}

        {/* Page Content */}
        <main className="flex flex-auto flex-col max-w-full pt-16">
          <Outlet />
        </main>
        {/* END Page Content */}

        {/* Page Footer */}
        <footer className="flex flex-none items-center bg-white">
          <div className="text-center flex flex-col md:text-left md:flex-row md:justify-between text-sm max-w-10xl mx-auto px-4 lg:px-8 w-full">
            <div className="pt-4 pb-1 md:pb-4">
              <a
                href="https://google.com"
                target="_blank"
                className="font-medium text-gray-600 hover:text-gray-400"
              >
                JobBoard
              </a>{' '}
              ©
            </div>
            <div className="pb-4 pt-1 md:pt-4 inline-flex items-center justify-center">
              <span>Crafted with</span>
              <svg
                className="hi-solid hi-heart inline-block w-4 h-4 mx-1 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                by{' '}
                <a
                  href="https://google.com"
                  target="_blank"
                  className="font-medium text-gray-600 hover:text-gray-400"
                >
                  nadeera
                </a>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
