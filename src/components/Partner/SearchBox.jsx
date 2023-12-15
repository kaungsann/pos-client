import PropTypes from "prop-types";
import { Input } from "@nextui-org/react";
import { Icon } from "@iconify/react";

const SearchBox = ({ keyword, onSearch }) => {
  const handleInputChange = (key, value) => {
    onSearch({
      [key]: value,
    });
  };

  return (
    <>
      <div>
        <Input
          isClearable
          type="text"
          radius="sm"
          variant="faded"
          classNames={{
            inputWrapper: ["shadow-sm h-[7px]"],
          }}
          placeholder="Search by name..."
          value={keyword}
          onChange={(e) => handleInputChange("name", e.target.value)}
          onClear={() => handleInputChange("name", "")}
          startContent={<Icon icon="ic:sharp-search" />}
        />
      </div>
    </>
  );
};

SearchBox.propTypes = {
  keyword: PropTypes.string,
  onSearch: PropTypes.func,
};

export default SearchBox;
