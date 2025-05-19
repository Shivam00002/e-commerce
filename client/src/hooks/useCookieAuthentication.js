import { useEffect, useState } from "react";

const useCookieAuthentication = (cookieName) => {
  const [cookieValue, setCookieValue] = useState(null);

  useEffect(() => {
    const getCookie = () => {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${cookieName}=`)) {
          return cookie.substring(cookieName.length + 1);
        }

      }

      return null;
    };


    const cookie = getCookie();
    setCookieValue(cookie);
  }, [cookieName]);

  return cookieValue;
};

export default useCookieAuthentication;
