import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import SearchBox from "./SearchBox";
import CategoryList from "./CategoryList";

export default function CategoryTemplate() {
  return (
    <div>
      <h2 className="lg:text-xl font-bold my-2">Category</h2>

      <CategoryList />
    </div>
  );
}
