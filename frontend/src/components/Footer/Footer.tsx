function Footer() {
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
                            Company Inc
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
                        <form
                            className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-2"
                        >
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
                                className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-indigo-700 bg-indigo-700 text-white hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 active:bg-indigo-700 active:border-indigo-700"
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
                        <a
                            href="www.google.com"
                            className="text-gray-400 hover:text-indigo-600"
                        >
                            <svg
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon-github inline-block w-5 h-5"
                            >
                                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
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
                                className="icon-github inline-block w-5 h-5"
                            >
                                <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073a42.153 42.153 0 00-.767-1.68c2.31-1 4.165-2.358 5.548-4.082a9.863 9.863 0 012.322 5.835zm-3.842-7.282c-1.205 1.554-2.868 2.783-4.986 3.68a46.287 46.287 0 00-3.488-5.438A9.894 9.894 0 0112 2.087c2.275 0 4.368.779 6.043 2.072zM7.527 3.166a44.59 44.59 0 013.537 5.381c-2.43.715-5.331 1.082-8.684 1.105a9.931 9.931 0 015.147-6.486zM2.087 12l.013-.256c3.849-.005 7.169-.448 9.95-1.322.233.475.456.952.67 1.432-3.38 1.057-6.165 3.222-8.337 6.48A9.865 9.865 0 012.087 12zm3.829 7.81c1.969-3.088 4.482-5.098 7.598-6.027a39.137 39.137 0 012.043 7.46c-3.349 1.291-6.953.666-9.641-1.433zm11.586.43a41.098 41.098 0 00-1.92-6.897c1.876-.265 3.94-.196 6.199.196a9.923 9.923 0 01-4.279 6.701z" />
                            </svg>
                        </a>
                    </nav>
                    <div className="text-gray-500">
                        <span className="font-medium">Company Inc</span> © 2021
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer;