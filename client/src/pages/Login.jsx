import React from "react";

const Login = () => {
  return (
    <div className="mt-16 bg-white border md:w-[400px] mx-auto border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="p-4 sm:p-7">
        <div className="text-center">
          <h1 className="block text-2xl font-semibold text-gray-800 dark:text-white">
            Welcome back to ECOMMERCE
          </h1>
        </div>
        <p className="text-center">The next gen business marketplace</p>
        <div className="mt-5">
          <form>
            <div className="grid gap-y-4">
              <div>
                <label
                  for="email"
                  className="block text-sm mb-2 dark:text-white"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="py-3 border px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                    required
                    placeholder="Enter"
                    aria-describedby="password-error"
                  />
                </div>
              </div>

              <div>
                <label
                  for="password"
                  className="block text-sm mb-2 dark:text-white"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="py-3 border px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                    required
                    placeholder="Enter"
                    aria-describedby="confirm-password-error"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 inline-flex justify-center items-center gap-x-2 text-[13px] font-semibold rounded-lg border border-transparent  bg-black text-white hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              >
              LOGIN
              </button>

              <p className="mt-2  text-center text-sm text-gray-600 dark:text-gray-400">
                Don’t have an Account?
                <a
                  className=" ml-1 decoration-2 hover:underline font-medium text-black"
                  href="/Signup"
                >
                  SIGN UP
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
