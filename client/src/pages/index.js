import Image from "next/image";
import { Inter } from "next/font/google";
import Otpform from "@/components/Otpform";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
    
      <Otpform />
    </main>
  );
}
