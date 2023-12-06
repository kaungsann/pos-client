import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../Api";
import ProductList from "./ProductList";
import FilterBox from "./FilterBox";
import SearchBox from "./SearchBox";
import ExcelExportButton from "../../utils/ExcelExportButton";
import ExcelImportButton from "../../utils/ExcelImportButton";
import axios from "axios";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function CategoryTemplate() {
  return <div>CategoryTemplate</div>;
}
