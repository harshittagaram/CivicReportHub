import React, { useState, useRef, useContext } from "react";
import ReportDisplay from "../ReportDisplay/ReportDisplay";
import { ReportContext } from "../ReportContext/ReportContext";
import { categories } from "../../assets/assets";
import "./ReportCategoryFilter.css";

const ReportCategoryFilter = () => {
  const { sortOrder, setSortOrder, refreshReports } = useContext(ReportContext);
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

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    refreshReports({ category: category === "All" ? null : category });
  };

  return (
    <div className="report-category-filter position-relative container mt-4">
      <h3 className="d-flex align-items-center justify-content-between mb-3">
        <span className="d-flex align-items-center">
          Explore Reports by Category
          <select
            className="form-select ms-3 w-auto"
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option value="desc">Latest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </span>
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
              className={`${item.category === category ? "active" : ""}`}
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
