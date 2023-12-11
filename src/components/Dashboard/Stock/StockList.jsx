import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "@nextui-org/react";

import { statusOptions } from "../Category/data";
import { capitalize } from "../Category/utils";
import SearchBox from "../../utils/SearchBox";
import ExcelExportButton from "../../ExcelExportButton";
import ExcelImportButton from "../../ExcelImportButton";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Api";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { Icon } from "@iconify/react";

const INITIAL_VISIBLE_COLUMNS = ["product", "location", "quantity", "updateon"];

const columns = [
  { name: "Product", uid: "product", sortable: true },
  { name: "Location", uid: "location", sortable: true },
  { name: "Quantity", uid: "quantity", sortable: true },
  { name: "UpdateOn", uid: "updateon", sortable: true },
];

export default function StockList({ stocks }) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();

  const STOCK_API = {
    INDEX: BASE_URL + "/stock",
    IMPORT: BASE_URL + "/stock/import-excel",
    EXPORT: BASE_URL + "/stock/export-excel",
  };

  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "Product",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredStocks = [...stocks];

    if (hasSearchFilter) {
      filteredStocks = filteredStocks.filter((stk) =>
        stk.product.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredStocks = filteredStocks.filter((stk) =>
        Array.from(statusFilter).includes(stk.product.name)
      );
    }

    return filteredStocks;
  }, [stocks, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((stocks, columnKey) => {
    const cellValue = stocks[columnKey];

    switch (columnKey) {
      case "updateon":
        return <h3> {format(new Date(stocks.updatedAt), "yyyy-MM-dd")}</h3>;
      case "product":
        return (
          <h3>
            {stocks.product && stocks.product.name
              ? stocks.product.name
              : "none"}
          </h3>
        );
      case "location":
        return (
          <h3>{stocks.location ? stocks.location.name : "no have location"}</h3>
        );
      case "quantity":
        return <h3>{stocks.onHand}</h3>;
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <SearchBox
            value={filterValue}
            clear={onClear}
            changeValue={onSearchChange}
          />
          <div className="flex">
            <div>
              <ExcelExportButton
                token={token.accessToken}
                apiEndpoint={STOCK_API.EXPORT}
              />
            </div>
            <div className="mx-3">
              <ExcelImportButton
                token={token.accessToken}
                apiEndpoint={STOCK_API.IMPORT}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">Stock</h2>
            <h3 className="text-default-400 text-small ml-4">
              Total {stocks.length}
            </h3>
          </div>

          <div className="flex">
            <label className="flex items-center text-default-400 text-small mr-4">
              Rows per page:
              <select
                className="bg-transparent outline-none text-default-400 text-small"
                onChange={onRowsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </label>
            <Dropdown>
              <div>
                <DropdownTrigger className="hidden sm:flex">
                  <Icon icon="system-uicons:filtering" />
                </DropdownTrigger>
              </div>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    stocks.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No stocks found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
