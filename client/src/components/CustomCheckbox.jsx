import React from "react";

export const CustomCheckbox = ({ checked, onChange }) => {
  return (
    <div
      className={`inline-block w-[22px] h-[22px] border rounded cursor-pointer ${
        checked ? "bg-black text-white" : "text-black"
      }`}

      onClick={onChange}
    >
      {checked && <span className="ml-1">&#10003;</span>}
    </div>
  );
};
