"use client";
import React, { useEffect } from "react";
import Otpform from "@/components/Otpform";
import { useSearchParams,useRouter } from "next/navigation";
export default function OtpVerification() {
  const searchParams = useSearchParams();
  const router=useRouter()
  const verification_id = searchParams.get("verification_id");
  useEffect(()=>{
    if (!verification_id) {
      router.push("/Signup");
    }
  },[verification_id])
  
  return (
    <>
      <Otpform />
    </>
  );
}
