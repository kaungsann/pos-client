import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
} from "@nextui-org/react";

import { statusOptions } from "../Category/data";
import { capitalize } from "../Category/utils";
import SearchBox from "../Category/SearchBox";
import ExcelExportButton from "../../ExcelExportButton";
import ExcelImportButton from "../../ExcelImportButton";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Api";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { format } from "date-fns";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};
//const INITIAL_VISIBLE_COLUMNS = ["name", "role", "status", "actions"];

const INITIAL_VISIBLE_COLUMNS = [
  "orderdate",
  "name",
  "partner",
  "location",
  "state",
  "actions",
];

const columns = [
  { name: "ORDERDATE", uid: "orderdate", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "PARTNER", uid: "partner", sortable: true },
  { name: "LOCATION", uid: "location", sortable: true },
  { name: "STATE", uid: "state" },
  { name: "TOTAL PRODUCT", uid: "totalproduct" },
  { name: "TAX TOTAL", uid: "taxtotal", sortable: true },
  { name: "TOTAL", uid: "total" },
  { name: "ACTIONS", uid: "actions" },
];

export default function SaleList({ sales }) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();

  const addPurchaseRoute = () => {
    navigate("/admin/purchase/create");
  };
  const SALE_API = {
    INDEX: BASE_URL + "/sale",
    IMPORT: BASE_URL + "/sale/import-excel",
    EXPORT: BASE_URL + "/sale/export-excel",
  };

  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "Order Date",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return INITIAL_VISIBLE_COLUMNS;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredSale = [...sales];

    if (hasSearchFilter) {
      filteredSale = filteredSale.filter((sale) =>
        sale.partner.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredSale = filteredSale.filter((sale) =>
        Array.from(statusFilter).includes(sale.status)
      );
    }

    return filteredSale;
  }, [sales, filterValue, statusFilter]);

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

  const renderCell = React.useCallback((sales, columnKey) => {
    const cellValue = sales[columnKey];

    switch (columnKey) {
      case "orderdate":
        return <h3> {format(new Date(sales.orderDate), "yyyy-MM-dd")}</h3>;
      case "name":
        return <h3>{sales.user?.username}</h3>;
      case "partner":
        return <h3>{sales.partner?.name}</h3>;
      case "location":
        return <h3>{sales.location?.name}</h3>;
      case "state":
        return (
          <div className="flex gap-4">
            {sales.state === "pending" ? (
              <Chip color="danger" variant="bordered">
                {sales.state}
              </Chip>
            ) : (
              <Chip color="success" variant="bordered">
                {sales.state}
              </Chip>
            )}
          </div>
        );
      case "totalproduct":
        return <h3>{sales.lines.length}</h3>;
      case "taxtotal":
        return <h3>{purchases.taxTotal}</h3>;
      case "total":
        return <h3>{sales.total}</h3>;
      case "actions":
        return (
          <Icon
            icon="mdi:eye-outline"
            onClick={() => {
              navigate(`/admin/saleorders/detail/${sales.id}`);
            }}
            className="text-2xl text-cyan-800 hover:cyan-500 font-bold"
          />
        );
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
        <div className="flex justify-between gap-3 items-end">
          <SearchBox
            value={filterValue}
            clear={onClear}
            changeValue={onSearchChange}
          />
          <div className="flex gap-3">
            <div>
              <ExcelExportButton
                token={token.accessToken}
                apiEndpoint={SALE_API.EXPORT}
              />
            </div>
            <div>
              <ExcelImportButton
                token={token.accessToken}
                apiEndpoint={SALE_API.IMPORT}
              />
            </div>
            <Dropdown>
              <div>
                <DropdownTrigger className="hidden sm:flex">
                  <button className="font-bold rounded-sm shadow-sm flex items-center text-cyan-700 border-cyan-700 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-cyan-700 px-3 py-1.5">
                    Status
                  </button>
                </DropdownTrigger>
              </div>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <div>
                <DropdownTrigger className="hidden sm:flex">
                  <button className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5">
                    Columns
                  </button>
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

            <button
              onClick={addPurchaseRoute}
              className="text-white bg-blue-600 rounded-sm py-1.5 px-4 hover:opacity-75"
            >
              Add New
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-bold my-2">Sales</h2>
            <h3 className="text-default-400 text-small ml-4">
              Total {sales.length}
            </h3>
          </div>

          <label className="flex items-center text-default-400 text-small">
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
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    sales.length,
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

  console.log("items is purchase", items);

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
        <TableBody emptyContent={"No Purchases found"} items={sortedItems}>
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
