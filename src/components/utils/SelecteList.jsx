import { Select } from "@nextui-org/react";
import React from "react";

export default function SelecteList() {
  return (
    <>
      <Select
        labelPlacement="outside"
        label="Discount"
        name="name"
        placeholder="Select Discount Type"
        className="max-w-xs"
        //value={formData.name}
        //onChange={(e) => handleInputChange(e)}
      >
        <SelecteList key="New Year Discount" value="New Year Discount">
          New Year Discount
        </SelectItem>
        <SelectItem key="Birthday Discount" value="Birthday Discount">
          Birthday Discount
        </SelectItem>
      </Select>
    </>
  );
}
