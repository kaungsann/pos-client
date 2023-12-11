import React from "react";
import { Input } from "@nextui-org/react";
import { Icon } from "@iconify/react";
export default function SearchBox({ onClear, changeValue, value }) {
  return (
    <div>
      <Input
        isClearable
        type="text"
        radius="sm"
        variant="faded"
        classNames={{
          inputWrapper: ["shadow-sm h-[7px]"],
        }}
        startContent={<Icon icon="ic:sharp-search" />}
        placeholder="Search by name..."
        value={value}
        onClear={onClear}
        onValueChange={changeValue}
      />
    </div>
  );
}
