import React, { useState, useEffect } from "react";
import faker from "faker";
import { Pagination } from "./Pagination";
import { CustomCheckbox } from "./CustomCheckbox";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

const HomePage = ({ numberOfCategories }) => {
  const [id, setId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const categoriesPerPage = 10;
  const [fakeCategories, setFakeCategories] = useState([]);
  const token = Cookies.get("token");

  const decodeCookie = (token) => {
    try {
      if (token) {
        const decodedData = jwt.decode(token);
        setId(decodedData.userId);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  useEffect(() => {
    decodeCookie(token);
    console.log("idddddd", id);
  }, [token]);

  useEffect(() => {
    const categories = Array.from({ length: numberOfCategories }, () =>
      faker.commerce.department()
    );
    setFakeCategories(categories);
  }, [numberOfCategories]);

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = fakeCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prevInterests) => {
      if (prevInterests.includes(interest)) {
        return prevInterests.filter((item) => item !== interest);
      } else {
        return [...prevInterests, interest];
      }
    });
  };

  return (
    <div className="md:mt-40 -z-50 bg-white mt-14 md:w-[400px] w-full h-fit mx-auto shadow-md rounded-md px-4 py-4">
      <h2 className="text-center font-semibold md:text-[25px] text-[22px]">
        Please mark your interests!
      </h2>
      <p className="text-center md:py-2">We will keep you notified.</p>
      <p className="font-semibold md:text-[15px] py-2 md:py-4">
        My saved interests!
      </p>
      <ul>
        {currentCategories.map((category, index) => (
          <li key={index}>
            <label className="inline-flex items-center">
              <CustomCheckbox
                checked={selectedInterests.includes(category)}
                onChange={() => handleInterestToggle(category)}
              />
              <span className="ml-2">{category}</span>
            </label>
          </li>
        ))}
      </ul>

      <Pagination
        totalPages={Math.ceil(fakeCategories.length / categoriesPerPage)}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default HomePage;
