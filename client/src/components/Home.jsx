
import React, { useState, useEffect } from "react";
import faker from "faker";
import { Pagination } from "./Pagination";
import { CustomCheckbox } from "./CustomCheckbox";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
import axios from "axios";

const fakeCategories = Array.from({ length: 100 }, () => ({
  name: faker.commerce.department(),
  id: faker.datatype.uuid(),
}));

const HomePage = () => {
  const [userId, setUserId] = useState(""); // Changed to userId
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState("");
  const categoriesPerPage = 10;
  console.log(selectedInterests);
  useEffect(() => {
    const token = Cookies.get("token");
    const decodeCookie = () => {
      try {
        if (token) {
          const decodedData = jwt.decode(token);
          setUserId(decodedData.userId);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    decodeCookie();
  }, []); // No dependency, runs only once on mount

  useEffect(() => {
    if (userId) {
      postSelectedInterests();
      deleteUnselectedInterests();
    }
  }, [selectedInterests, userId]); // Only call functions when dependencies change

  const postSelectedInterests = async () => {
    try {
      const data = {
        id: userId,
        interests: selectedInterests.map((interest) => interest.name),
      };
      console.log(interests); ['movies','toys']
      // const response = await axios.post(
      //   "https://e-commerce-dom5.onrender.com/interests",
      //   data
      // );
      // console.log("Interests posted:", response.data);
    } catch (error) {
      console.error("Error posting interests:", error);
    }
  };

  // const deleteUnselectedInterests = async () => {
  //   try {
  //     const unselectedInterests = fakeCategories
  //       .map((category) => category.id)
  //       .filter(
  //         (categoryId) =>
  //           !selectedInterests.some((interest) => interest.id === categoryId)
  //       );

  //     const data = {
  //       userId: userId,
  //       interests: unselectedInterests,
  //     };

  //     const response = await axios.delete(
  //       "https://e-commerce-dom5.onrender.com/interests",
  //       { data }
  //     );
  //     console.log("Unselected interests deleted:", response.data);
  //   } catch (error) {
  //     console.error("Error deleting unselected interests:", error);
  //   }
  // };

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = fakeCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleInterestToggle = (interest) => {
    setSelectedInterests((prevInterests) => {
      if (prevInterests.some((item) => item.id === interest.id)) {
        return prevInterests.filter((item) => item.id !== interest.id);
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
          <li key={category.id}>
            <label className="inline-flex items-center">
              <CustomCheckbox
                checked={selectedInterests.some(
                  (item) => item.id === category.id
                )}
                onChange={() => handleInterestToggle(category)}
              />
              <span className="ml-2">{category.name}</span>
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