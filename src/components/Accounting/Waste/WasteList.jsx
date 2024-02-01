import React, { useState } from "react";
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
  Spinner,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { orderConfirmApi } from "../../Api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "ref",
  "date",
  "quantity",
  "state",
  "created",
  "actions",
];

const columns = [
  { name: "Name", uid: "name", sortable: true },
  { name: "Ref", uid: "ref", sortable: true },
  { name: "Date", uid: "date", sortable: true },
  { name: "Quantity", uid: "quantity" },
  { name: "State", uid: "state", sortable: true },
  { name: "Create-Date", uid: "created", sortable: true },
  { name: "Action", uid: "actions" },
];

export default function WasteList({ opexs, refresh }) {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "",
    direction: "ascending",
  });

  const [loadingData, setLoadData] = useState(false);
  const [page, setPage] = React.useState(1);

  const navigate = useNavigate();
  const token = useSelector((state) => state.IduniqueData);

  const hasSearchFilter = Boolean(filterValue);

  // Use function references instead of invoking functions directly
  const changeConfirmOpex = async (id) => {
    const response = await orderConfirmApi(
      `/waste/${id}?state=approved`,
      token.accessToken
    );

    if (response.success === false) {
      toast.error(response.message);
    } else {
      setLoadData(false);
      refresh();
      toast.success(response.message);
    }

    setLoadData(false);
  };

  const changeRejectOpex = async (id) => {
    const response = await orderConfirmApi(
      `/waste/${id}?state=rejected`,
      token.accessToken
    );

    if (response.success === false) {
      toast.error(response.message);
    } else {
      refresh();
      toast.success(response.message);
    }

    setLoadData(false);
  };

  const handleChangeConfirm = (id) => {
    setLoadData(true);
    changeConfirmOpex(id);
  };

  const handleChangeReject = (id) => {
    setLoadData(true);
    changeRejectOpex(id);
  };

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredOpex = [...opexs];

    if (hasSearchFilter) {
      filteredOpex = filteredOpex.filter((op) =>
        op.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredOpex = filteredOpex.filter((op) =>
        Array.from(statusFilter).includes(op.state)
      );
    }

    return filteredOpex;
  }, [opexs, filterValue, statusFilter]);

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

  const renderCell = React.useCallback((opexs, columnKey) => {
    const cellValue = opexs[columnKey];

    switch (columnKey) {
      case "name":
        return <h3>{opexs.name}</h3>;
      case "ref":
        return <h3>{opexs.ref}</h3>;
      case "date":
        return <h3>{format(new Date(opexs.date), "yyyy-MM-dd")}</h3>;
      case "quantity":
        return <h3>{opexs.quantity}</h3>;
      case "state":
        return (
          <div className="flex gap-4 w-24">
            {opexs.state === "pending" ? (
              <Chip
                color="danger"
                variant="bordered"
                className="bg-red-50 w-full"
              >
                {opexs.state}
              </Chip>
            ) : opexs.state === "approved" ? (
              <Chip
                color="success"
                variant="bordered"
                className="bg-green-50 px-2 w-full"
              >
                {opexs.state}
              </Chip>
            ) : (
              <Chip
                color="warning"
                variant="bordered"
                className="bg-red-50 px-2 w-full"
              >
                {opexs.state}
              </Chip>
            )}
          </div>
        );
      case "created":
        return <h3>{format(new Date(opexs.createdAt), "yyyy-MM-dd")}</h3>;
      case "actions":
        return (
          <div
            className="flex justify-between items-center"
            aria-label="action"
          >
            <div className="relative flex justify-start items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <Icon icon="fluent:grid-dots-28-regular" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="action">
                  <DropdownItem
                    onPress={() => {
                      navigate(`/admin/waste/detail/${opexs.id}`);
                    }}
                    className="text-blue-600"
                  >
                    View
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleChangeConfirm(opexs.id)}
                    className="text-green-600"
                  >
                    Confirm
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleChangeReject(opexs.id)}
                    className="text-red-600"
                  >
                    Reject
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
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
          <div className="flex items-end ml-3">
            <h2 className="text-xl font-bold">Waste</h2>
            <h3 className="text-default-400 text-md pl-4">
              Total {opexs.length}
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
              <div className="mx-4">
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
                  <DropdownItem key={column.uid}>{column.name}</DropdownItem>
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
    opexs.length,
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
    <div className="relative">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
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
        <TableBody emptyContent={"No records"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {loadingData && (
        <div className="absolute top-0 w-full h-screen flex items-center justify-center bg-slate-50 opacity-75">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
}
