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
  Chip,
  Pagination,
} from "@nextui-org/react";

import SearchBox from "../../utils/SearchBox";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Api";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { format } from "date-fns";

let INITIAL_VISIBLE_COLUMNS = [
  "orderdate",
  "name",
  "partner",
  "location",
  "paymentstatus",
  "state",
  "total",
];

let columns = [
  { name: "OrderDate", uid: "orderdate" },
  { name: "Name", uid: "name" },
  { name: "Partner", uid: "partner" },
  { name: "Location", uid: "location" },
  { name: "PaymentStatus", uid: "paymentstatus" },
  { name: "State", uid: "state" },
  { name: "TotalProduct", uid: "totalproduct", sortable: true },
  { name: "TaxTotal", uid: "taxtotal", sortable: true },
  { name: "Total", uid: "total", sortable: true },
];

export default function WareHouseList({ warehouses }) {
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "name",
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
    let filteredWarehouse = [...warehouses];

    if (hasSearchFilter) {
      filteredWarehouse = filteredWarehouse.filter((wh) =>
        wh.partner.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredWarehouse;
  }, [warehouses, filterValue, statusFilter]);

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

  const renderCell = React.useCallback((warehouses, columnKey) => {
    const cellValue = warehouses[columnKey];

    switch (columnKey) {
      case "orderdate":
        return <h3>{format(new Date(warehouses.orderDate), "yyyy-MM-dd")}</h3>;
      case "name":
        return <h3>{warehouses.user?.username}</h3>;
      case "partner":
        return <h3>{warehouses.partner?.name}</h3>;
      case "location":
        return <h3>{warehouses.location?.name}</h3>;
      case "paymentstatus":
        return <h3>{warehouses.paymentStatus}</h3>;
      case "state":
        return (
          <div className="flex gap-4">
            {warehouses.state === "pending" ? (
              <Chip color="danger" variant="bordered">
                {warehouses.state}
              </Chip>
            ) : (
              <Chip color="success" variant="bordered">
                {warehouses.state}
              </Chip>
            )}
          </div>
        );
      case "totalproduct":
        return <h3>{warehouses.lines.length}</h3>;
      case "taxtotal":
        return <h3>{warehouses.taxTotal.toFixed(2)}</h3>;
      case "total":
        return <h3>{warehouses.total.toFixed(2)}</h3>;
      // case "actions":
      //   return (
      //     <Icon
      //       icon="prime:eye"
      //       className="text-xl hover:opacity-75"
      //       onClick={() => {
      //         navigate(`/admin/saleorders/detail/${warehouses.id}`);
      //       }}
      //     />
      //   );
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
            text="Enter by partner name"
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">Warehouses</h2>
            <h3 className="text-default-400 text-small ml-4">
              Total {warehouses.length}
            </h3>
          </div>
          <div className="flex items-center">
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
            <Dropdown>
              <div>
                <DropdownTrigger className="hidden sm:flex">
                  <Icon icon="system-uicons:filtering" className="mx-4" />
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
                    {column.name}
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
    warehouses.length,
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

  console.log("warehouse items", items);

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
        <TableBody emptyContent={"No warehouse found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item._id}>
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
