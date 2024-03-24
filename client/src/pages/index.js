import { Inter } from "next/font/google";
import HomePage from "@/components/Home";
import useCookieAuthentication from "../hooks/useCookieAuthentication";
import Signup from "./Signup";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const COOKIE_NAME = "token";
  const authToken = useCookieAuthentication(COOKIE_NAME);

  return (
    <main>
      {authToken ? <HomePage numberOfCategories={100} /> : <Signup />}
    </main>
  );
}
