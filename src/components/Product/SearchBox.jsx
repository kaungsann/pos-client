import PropTypes from "prop-types";
import { Input } from "@nextui-org/react";

const SearchBox = ({ keyword, onSearch }) => {
  const handleInputChange = (key, value) => {
    onSearch({
      [key]: value,
    });
  };

  return (
    <div>
      <Input
        type="text"
        variant="underlined"
        label="search by name"
        id="name"
        name="name"
        value={keyword}
        onChange={(e) => handleInputChange("name", e.target.value)}
        radius="sm"
        classNames={{
          inputWrapper: ["shadow-sm w-60"],
        }}
      />
    </div>
  );
};

SearchBox.propTypes = {
  keyword: PropTypes.string,
  onSearch: PropTypes.func,
};

export default SearchBox;
