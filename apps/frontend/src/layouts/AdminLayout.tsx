import { MapPinned, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import { deleteJWTToken } from '../utils';
import appStateStore from '../store';
import Logo from '../assets/images/logo.png';
import { DashboardFooter } from '../components/Footer';

export const AdminLayout = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { getCurrentUser, user } = appStateStore(state => state);

  useEffect(() => {
    getCurrentUser();
  }, []);

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

  const onClickSignOut = () => {
    deleteJWTToken();
    navigate(`/auth`);
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
              href="/"
              className="inline-flex items-center space-x-2 font-bold text-lg tracking-wide text-primary hover:text-gray-500"
            >
              <img className="inline-block w-6 h-6" alt="logo" src={Logo} />
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
                  to="/admin"
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
                  to="/admin/users"
                  className={`flex items-center space-x-3 px-3 font-medium rounded text-gray-600 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-50`}
                >
                  <span className="flex-none flex items-center">
                    <Users className="hi-outline hi-clipboard-list inline-block w-5 h-5" />
                  </span>
                  <span className="py-2 flex-grow">Users</span>
                </Link>
                <Link
                  to="/admin/categories"
                  className={`flex items-center space-x-3 px-3 font-medium rounded text-gray-600 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-50`}
                >
                  <span className="flex-none flex items-center">
                    <svg
                      className="hi-outline hi-clipboard-list inline-block w-5 h-5"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </span>
                  <span className="py-2 flex-grow">Categories</span>
                </Link>
                <Link
                  to="/admin/locations"
                  className="flex items-center space-x-3 px-3 font-medium rounded text-gray-600 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-50"
                >
                  <span className="flex-none flex items-center">
                    <MapPinned className="hi-outline hi-clipboard-list inline-block w-5 h-5" />
                  </span>
                  <span className="py-2 flex-grow">Locations</span>
                </Link>

                <div className="px-3 pt-5 pb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                  Account
                </div>
                <Link
                  to="/admin/settings"
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
                  onClick={() => onClickSignOut()}
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
        <aside
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
                      <a
                        role="menuitem"
                        href=""
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
                      </a>
                    </div>
                    <div className="p-2 space-y-1">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => onClickSignOut()}
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
        </aside>
        <main className="flex flex-auto flex-col max-w-full pt-16">
          <Outlet />
        </main>
        <DashboardFooter />
      </div>
    </>
  );
};
