import React, { useState } from "react";

const FilterBox = ({ onFilterChange }) => {
  const [filterName, setFilterName] = useState("");
  const [filterCode, setFilterCode] = useState("");

  const handleFilterChange = () => {
    onFilterChange({
      name: filterName,
      code: filterCode,
    });
  };

  return (
    <div>
      {/* Filter form */}
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="code">Code:</label>
        <input
          type="text"
          id="code"
          name="code"
          value={filterCode}
          onChange={(e) => setFilterCode(e.target.value)}
        />
      </div>
      <button onClick={handleFilterChange}>Apply Filters</button>
    </div>
  );
};

export default FilterBox;
