import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return  (
<>
<Navbar/>
<Component {...pageProps} />;
<Toaster toastOptions={{ position: 'top-center', style: { fontSize: "20px" } }} />
</>
  )

 
}
