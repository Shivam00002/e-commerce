import axios from "axios";
import React, { useState } from "react";
import jwt from "jsonwebtoken";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const Otpform = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verification_id = searchParams.get("verification_id");


  const decodeCookie = (token) => {
    console.log("decoderfound for token", token);
    try {
      if (token) {
        const decodedData = jwt.decode(token);
        return decodedData;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const [otp, setOTP] = useState(0);
  const [loading, setLoading] = useState(false);

  const VerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = decodeCookie(verification_id);
      const data = {
        otp,
        email: user.email,
      };
      //    toast.success("Please Enter OTP!");
      const response = await axios.post(
        "https://e-commerce-dom5.onrender.com/verifyotp",
        data,
        { withCredentials: true }
      );
      if (response.data.status) {
        toast.success("Registration successful!");
        router.push("/Login");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto border px-4 py-4 mt-20 rounded">
      <h2 className="text-center font-bold md:text-[24px]  ">
        Verify your email
      </h2>
      <p className="text-center font-gray-200 leading-5 text-[16px]">
        Enter the 4 digit code you have received on anu***@gmail.com
      </p>
      <form className="shadow-md  px-4 py-10" onSubmit={(e) => VerifyOTP(e)}>
        <p className="px-[3px] ">Code</p>
        <div className="flex justify-center gap-2 mb-6">
          <input
            onChange={(e) => setOTP(e.target.value)}
            className="bg-gray-50 border text-center border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            maxLength="4"
            placeholder="1234"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 inline-flex justify-center items-center gap-x-2 text-[13px] font-semibold rounded-lg border border-transparent  bg-black text-white hover:bg-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
          disabled={loading}
        >
          {loading ? "Loading..." : "VERIFY"}
        </button>
      </form>
    </div>
  );
};

export default Otpform;
