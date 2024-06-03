import { Link } from 'react-router-dom';

export const RegisterPage = () => {
  return (
    <div className="py-6 lg:py-0 w-full md:w-8/12 lg:w-6/12 xl:w-4/12 relative">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold inline-flex items-center mb-1 space-x-3">
          <svg
            className="hi-solid hi-cube-transparent inline-block w-8 h-8 text-black"
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
          <span>jobBoard</span>
        </h1>
        <p className="text-gray-500">
          Create your own account in one single step
        </p>
      </div>
      <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden">
        <div className="p-5 lg:p-6 flex-grow w-full">
          <div className="sm:p-5 lg:px-10 lg:py-8">
            <form className="space-y-6">
              <div className="space-y-1">
                <label htmlFor="tk-pages-sign-up-name" className="font-medium">
                  Name
                </label>
                <input
                  className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-black focus:ring-none focus-visible:outline-none"
                  type="text"
                  id="tk-pages-sign-up-name"
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="tk-pages-sign-up-email" className="font-medium">
                  Email
                </label>
                <input
                  className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-black focus:ring-none focus-visible:outline-none"
                  type="email"
                  id="tk-pages-sign-up-email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="tk-pages-sign-up-password"
                  className="font-medium"
                >
                  Password
                </label>
                <input
                  className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-black focus:ring-none focus-visible:outline-none"
                  type="password"
                  id="tk-pages-sign-up-password"
                  placeholder="Choose a strong password"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="tk-pages-sign-up-password-confirm"
                  className="font-medium"
                >
                  Confirm Password
                </label>
                <input
                  className="block border border-gray-200 rounded px-5 py-3 leading-6 w-full focus:border-black focus:ring-none focus-visible:outline-none"
                  type="password"
                  id="tk-pages-sign-up-password-confirm"
                  placeholder="Confirm your chosen password"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="border border-gray-200 rounded h-4 w-4 text-indigo-500 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                />
                <span className="ml-2">
                  {' '}
                  I accept{' '}
                  <a
                    href="www.google.com"
                    className="underline text-gray-600 hover:text-gray-500"
                  >
                    terms &amp; conditions
                  </a>
                </span>
              </div>
              <button
                type="submit"
                className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none w-full px-4 py-3 leading-6 rounded border-black bg-black text-white hover:text-white hover:bg-gray-800 hover:border-gray-800 active:bg-black active:border-black focus-visible:outline-none"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
        <div className="py-4 px-5 lg:px-6 w-full text-sm text-center bg-gray-50">
          <Link
            className="font-medium text-black hover:text-gray-600"
            to="/auth"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
