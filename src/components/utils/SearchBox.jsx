import React from "react";
import { Input } from "@nextui-org/react";

export default function SearchBox({ onClear, changeValue, value }) {
  return (
    <div>
      <Input
        isClearable
        variant="faded"
        //className="w-full sm:max-w-[44%]"
        classNames={{
          inputWrapper: ["shadow-sm h-[7px]"],
        }}
        placeholder="Search by name..."
        value={value}
        onClear={onClear}
        onValueChange={changeValue}
      />
    </div>
  );
}
