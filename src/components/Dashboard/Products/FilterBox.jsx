import { useState } from "react";
import PropTypes from 'prop-types';

const FilterBox = ({ categories, onFilter }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState("");
  const [priceComparison, setPriceComparison] = useState("LESS");

  const handleFilterClick = () => {
    onFilter({
      category: selectedCategory,
      startDate,
      endDate,
      price: {
        value: price,
        comparison: priceComparison,
      },
    });
  };

  const handleClearFiltersClick = () => {
    setSelectedCategory("");
    setStartDate("");
    setEndDate("");
    setPrice("");
    setPriceComparison("LESS");
    onFilter({
      category: "",
      startDate: "",
      endDate: "",
      price: {
        value: "",
        comparison: "LESS",
      },
    });
  };

  return (
    <div>
      <div>
        <label htmlFor="name">Category</label>
        <select
          id="category"
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label htmlFor="startDate">Start Date</label>
        <input
          type="date"
          id="startDate"
          onChange={(e) => setStartDate(e.target.value)}
          value={startDate || ""}
        />

        <label htmlFor="endDate">End Date</label>
        <input
          type="date"
          id="endDate"
          onChange={(e) => setEndDate(e.target.value)}
          value={endDate || ""}
        />

        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          onChange={(e) => setPrice(e.target.value)}
          value={price || ""}
        />
        <select
          id="priceComparison"
          onChange={(e) => setPriceComparison(e.target.value)}
          value={priceComparison}
        >
          <option value="LESS">Less Than</option>
          <option value="GREATER">Greater Than</option>
        </select>

        <button onClick={handleFilterClick}>Apply</button>
        <button onClick={handleClearFiltersClick}>Clear</button>
      </div>
    </div>
  );
};

FilterBox.propTypes = {
  categories: PropTypes.array,
  onFilter: PropTypes.func,
}

export default FilterBox;
