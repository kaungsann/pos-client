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

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { format } from "date-fns";

const statusOptions = [
  { name: "pending", uid: "pending" },
  { name: "confirmed", uid: "confirmed" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "scheduledate",
  "name",
  "partner",
  "location",
  "state",
  "total",
  "orderref",
  "actions",
];

const columns = [
  { name: "Schedule-Date", uid: "scheduledate" },
  { name: "Name", uid: "name" },
  { name: "Partner", uid: "partner" },
  { name: "Location", uid: "location" },
  { name: "State", uid: "state" },
  { name: "TotalProduct", uid: "totalproduct" },
  { name: "TaxTotal", uid: "taxtotal", sortable: true },
  { name: "OrderRef", uid: "orderref" },
  { name: "Total", uid: "total", sortable: true },
  { name: "Action", uid: "actions" },
];

export default function SaleList({ sales }) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "",
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
        Array.from(statusFilter).includes(sale.state)
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
      case "scheduledate":
        return <h3>{format(new Date(sales.orderDate), "yyyy-MM-dd")}</h3>;
      case "name":
        return <h3>{sales.user?.username}</h3>;
      case "partner":
        return <h3>{sales.partner?.name}</h3>;
      case "location":
        return <h3>{sales.location?.name}</h3>;
      case "orderref":
        return <h3>{sales.orderRef}</h3>;

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
        return <h3>{sales.taxTotal.toFixed(2)}</h3>;
      case "total":
        return <h3>{sales.total.toFixed(2)}</h3>;
      case "actions":
        return (
          <div
            className="relative flex justify-start items-center gap-2"
            aria-label="action"
          >
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <Icon icon="fluent:grid-dots-28-regular" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="action">
                <DropdownItem
                  onPress={() => {
                    navigate(`/admin/saleorders/detail/${sales.id}`);
                  }}
                >
                  View
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
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

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-end">
            <h2 className="text-xl font-bold">Sale Orders</h2>
            <h3 className="text-default-400 text-md pl-4">
              Total {sales.length}
            </h3>
          </div>

          <div className="flex items-center">
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
            : `${selectedKeys.size} of ${filteredItems.length} `}
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
        <TableBody emptyContent={"No Sales found"} items={sortedItems}>
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
