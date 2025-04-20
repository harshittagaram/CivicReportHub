import React, { useState, useRef } from "react";
import ReportDisplay from "../ReportDisplay/ReportDisplay";
import { categories } from "../../assets/assets";
import "./ReportCategoryFilter.css"; // optional custom CSS file

const ReportCategoryFilter = () => {
  const [category, setCategory] = useState("All");
  const menuRef = useRef(null);

  const scrollLeft = () => {
    if (menuRef.current) {
      menuRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (menuRef.current) {
      menuRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="report-category-filter position-relative container mt-4">
      <h3 className="d-flex align-items-center justify-content-between mb-3">
        Explore Reports by Category
        <div className="d-flex">
          <i
            className="bi bi-arrow-left-circle scroll-icon me-2"
            onClick={scrollLeft}
          ></i>
          <i
            className="bi bi-arrow-right-circle scroll-icon"
            onClick={scrollRight}
          ></i>
        </div>
      </h3>

      <p className="mb-4">Select a category to filter reports</p>

      <div
        className="d-flex justify-content-between gap-4 overflow-auto explore-menu-list"
        ref={menuRef}
      >
        {categories.map((item, index) => (
          <div
            key={index}
            className="text-center explore-menu-list-item"
            onClick={() =>
              setCategory((prev) =>
                prev === item.category ? "All" : item.category
              )
            }
          >
            <img
              src={item.icon}
              alt={item.category}
              className={`rounded-circle ${
                item.category === category ? "active" : ""
              }`}
              height={150}
              width={150}
            />
            <p className="mt-2 fw-bold">{item.category}</p>
          </div>
        ))}
      </div>

      <hr className="mt-4" />

      <ReportDisplay category={category} searchText="" />
    </div>
  );
};

export default ReportCategoryFilter;
