import React, { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { LuShoppingCart } from "react-icons/lu";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken"
const Navbar = () => {
  const [username, setUsername] = useState("");
  const token = Cookies.get("token");
  const decodeCookie = (token) => {
    try {
      if (token) {
        const decodedData = jwt.decode(token);
        setUsername(decodedData.username)
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };
  useEffect(() => {
    decodeCookie(token);
  }, [token]);

  const NavLinks = [
    { name: "Categories", link: "/" },
    { name: "Sales", link: "/" },
    { name: "Clearance", link: "/" },
    { name: "New Stock", link: "/" },
    { name: "Tranding", link: "/" },
  ];

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="fixed top-0 z-50 bg-white left-0 right-0 w-full flex items-center justify-between h-fit px-4 md:px-8 py-2 shadow-lg">
      <h1 className="font-bold md:text-[20px] ">ECOMMERCE</h1>
      <div className="md:hidden cursor-pointer" onClick={toggleMobileMenu}>
        <svg
          className="w-8 h-8 "
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </div>
      <div className="md:flex hidden md:w-[550px] mx-auto items-center justify-around">
        {NavLinks.map((el, index) => (
          <a
            className="font-semibold md:text-[16px] cursor-pointer hover:text-green-800"
            key={index}
            href={el.link}
          >
            <h3>{el.name}</h3>
          </a>
        ))}
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-12 right-0 bg-[#edfbed] border shadow-md py-2 px-6">
          {NavLinks.map((el, index) => (
            <a
              className="font-semibold md:text-[17px] cursor-pointer "
              key={index}
              href={el.link}
            >
              <h3>{el.name}</h3>
            </a>
          ))}
        </div>
      )}
      <div className="hidden md:block">
        <div className="hidden md:flex text-[13px] gap-4">
          <p>Help</p>
          <p>Orders & Returns</p>
          <p>Hi, {username}</p>
        </div>

        <div className="hidden ml-36 md:flex items-center gap-4">
          <IoSearchOutline size={20} />
          <LuShoppingCart size={20} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
