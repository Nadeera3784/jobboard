export const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="container xl:max-w-7xl mx-auto px-4 py-16 lg:px-8 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-6">
            <h4 className="text-sm uppercase font-semibold tracking-wider text-gray-400">
              Products
            </h4>
            <nav className="flex flex-col space-y-3">
              <a
                href="www.google.com"
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                Solutions
              </a>
              <a
                href="www.google.com"
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                Features
              </a>
              <a
                href="www.google.com"
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                Pricing Plans
              </a>
              <a
                href="www.google.com"
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                Analytics
              </a>
              <a
                href="www.google.com"
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                Support Center
              </a>
            </nav>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm uppercase font-semibold tracking-wider text-gray-400">
              Legal
            </h4>
            <nav className="flex flex-col space-y-3">
              <a
                href="www.google.com"
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                Team
              </a>
              <a
                href="www.google.com"
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                Terms of Service
              </a>
              <a
                href="www.google.com"
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                Privacy Policy
              </a>
              <a
                href="www.google.com"
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                Cookies
              </a>
              <a
                href="www.google.com"
                className="font-medium text-gray-600 hover:text-gray-500"
              >
                Refunds
              </a>
            </nav>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm uppercase font-semibold tracking-wider text-gray-400">
              JobBoard Inc
            </h4>
            <div className="text-sm leading-relaxed">
              1080 Sunshine Valley, Suite 2563
              <br />
              San Francisco, CA 85214
              <br />
              <abbr title="Phone">P:</abbr> (123) 456-7890
            </div>
            <h4 className="text-sm uppercase font-semibold tracking-wider text-gray-400">
              Join Our Newsletter
            </h4>
            <form className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-2">
              <div className="sm:flex-grow">
                <label htmlFor="tk-footer-email" className="sr-only">
                  Email
                </label>
                <input
                  className="block border placeholder-gray-400 py-2 leading-5 text-sm w-full rounded border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  type="email"
                  id="tk-footer-email"
                  placeholder="Email"
                />
              </div>
              <button
                type="submit"
                className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-black bg-black text-white hover:text-white hover:bg-indigo-800 hover:border-gray-900 focus:ring focus:ring-black focus:ring-opacity-50 active:bg-black-700 active:border-black-700"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <hr className="my-10" />
        <div className="flex flex-col md:flex-row-reverse md:justify-between space-y-6 md:space-y-0 text-center md:text-left text-sm">
          <nav className="space-x-4">
            <a
              href="www.google.com"
              className="text-gray-400 hover:text-indigo-600"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="icon-twitter inline-block w-5 h-5"
              >
                <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-3.594-1.555c-3.179 0-5.515 2.966-4.797 6.045A13.978 13.978 0 011.671 3.149a4.93 4.93 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.928 4.928 0 004.6 3.419A9.9 9.9 0 010 19.54a13.94 13.94 0 007.548 2.212c9.142 0 14.307-7.721 13.995-14.646A10.025 10.025 0 0024 4.557z" />
              </svg>
            </a>
            <a
              href="www.google.com"
              className="text-gray-400 hover:text-indigo-600"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="icon-facebook inline-block w-5 h-5"
              >
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.192 5 15.115 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z" />
              </svg>
            </a>
            <a
              href="www.google.com"
              className="text-gray-400 hover:text-indigo-600"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="icon-instagram inline-block w-5 h-5"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </nav>
          <div className="text-gray-500">
            <span className="font-medium">JobBoard Inc</span> ©{' '}
            {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
};
