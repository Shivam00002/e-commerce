import Image from "next/image";
import { Inter } from "next/font/google";
import Otpform from "@/components/Otpform";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <Otpform />
    </main>
  );
}
