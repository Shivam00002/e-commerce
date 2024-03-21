import React from "react";

const Otpform = () => {
  return (
    <div className="max-w-md mx-auto border px-4 py-4 mt-20 rounded">
      <h2 className="text-center font-bold md:text-[24px]  ">
        Verify your emai
      </h2>
      <p className="text-center font-gray-200 leading-5 text-[16px]">
        Enter the 8 digit code you have received on anu***@gmail.com
      </p>
      <form className="shadow-md  px-4 py-10 ">
        <p className="px-[3px] ">Code</p>
        <div className="flex justify-center gap-2 mb-6">
          <input
            className="h-10 w-10 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
            type="text"
            maxlength="1"
            pattern="[0-9]"
            inputmode="numeric"
            autocomplete="one-time-code"
            required
          />
          <input
            className="h-10 w-10 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
            type="text"
            maxlength="1"
            pattern="[0-9]"
            inputmode="numeric"
            autocomplete="one-time-code"
            required
          />
          <input
            className="h-10 w-10 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
            type="text"
            maxlength="1"
            pattern="[0-9]"
            inputmode="numeric"
            autocomplete="one-time-code"
            required
          />
          <input
            className="h-10 w-10 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
            type="text"
            maxlength="1"
            pattern="[0-9]"
            inputmode="numeric"
            autocomplete="one-time-code"
            required
          />
          <input
            className="h-10 w-10 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
            type="text"
            maxlength="1"
            pattern="[0-9]"
            inputmode="numeric"
            autocomplete="one-time-code"
            required
          />
          <input
            className="h-10 w-10 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
            type="text"
            maxlength="1"
            pattern="[0-9]"
            inputmode="numeric"
            autocomplete="one-time-code"
            required
          />
          <input
            className="h-10 w-10 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
            type="text"
            maxlength="1"
            pattern="[0-9]"
            inputmode="numeric"
            autocomplete="one-time-code"
            required
          />
          <input
            className="h-10 w-10 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500"
            type="text"
            maxlength="1"
            pattern="[0-9]"
            inputmode="numeric"
            autocomplete="one-time-code"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 inline-flex justify-center items-center gap-x-2 text-[13px] font-semibold rounded-lg border border-transparent  bg-black text-white hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        >
          VERIFY
        </button>
      </form>
    </div>
  );
};

export default Otpform;
