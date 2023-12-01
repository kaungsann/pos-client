import PropTypes from "prop-types";

const SearchBox = ({ keyword, onSearch }) => {
  const handleInputChange = (key, value) => {
    onSearch({
      [key]: value,
    });
  };

  return (
    <div>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={keyword}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
      </div>
    </div>
  );
};

SearchBox.propTypes = {
  keyword: PropTypes.string,
  onSearch: PropTypes.func,
};

export default SearchBox;
