import React from "react";
import { Input } from "@nextui-org/react";

export default function SearchBox({ onClear, changeValue, value }) {
  return (
    <div>
      <Input
        isClearable
        variant="bordered"
        //className="w-full sm:max-w-[44%]"
        classNames={{
          inputWrapper: ["shadow-sm w-60 h-12"],
        }}
        placeholder="Search by name..."
        value={value}
        onClear={onClear}
        onValueChange={changeValue}
      />
    </div>
  );
}
