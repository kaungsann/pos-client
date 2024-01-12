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
  Chip,
} from "@nextui-org/react";

import { useNavigate } from "react-router-dom";
import { orderConfirmApi } from "../../Api";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import ConfrimBox from "../../utils/ConfrimBox";

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
  { name: "Partner", uid: "partner", sortable: true },
  { name: "Location", uid: "location", sortable: true },
  { name: "State", uid: "state" },
  { name: "TotalProduct", uid: "totalproduct", sortable: true },
  { name: "TaxTotal", uid: "taxtotal", sortable: true },
  { name: "Total", uid: "total", sortable: true },
  { name: "OrderRef", uid: "orderref" },
  { name: "Action", uid: "actions" },
];

export default function PurchaseList({ purchases, refresh }) {
  const [filterValue, setFilterValue] = React.useState("");
  const [confrimShowBox, setconfrimShowBox] = React.useState(false);
  const [ConfirmOrderId, setConfirmOrderId] = React.useState(null);

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "Order Date",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const totalLine = purchases.length;
  const totalPages = Math.ceil(totalLine / rowsPerPage);
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return INITIAL_VISIBLE_COLUMNS;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredPurchase = [...purchases];

    if (hasSearchFilter) {
      filteredPurchase = filteredPurchase.filter((pur) =>
        pur.partner.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredPurchase = filteredPurchase.filter((pur) =>
        Array.from(statusFilter).includes(pur.state)
      );
    }

    return filteredPurchase;
  }, [purchases, filterValue, statusFilter]);

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

  const renderCell = React.useCallback((purchases, columnKey) => {
    const cellValue = purchases[columnKey];

    switch (columnKey) {
      case "scheduledate":
        return <h3> {format(new Date(purchases.orderDate), "yyyy-MM-dd")}</h3>;
      case "name":
        return <h3>{purchases.user?.username}</h3>;
      case "partner":
        return <h3>{purchases.partner?.name}</h3>;
      case "location":
        return <h3>{purchases.location?.name}</h3>;
      case "orderref":
        return <h3>{purchases.orderRef}</h3>;
      case "state":
        return (
          <div className="flex gap-4 w-24">
            {purchases.state === "pending" ? (
              <Chip
                color="danger"
                variant="bordered"
                className="bg-red-50 w-full"
              >
                {purchases.state}
              </Chip>
            ) : (
              <Chip
                color="success"
                variant="bordered"
                className="bg-green-50 px-2 w-full"
              >
                {purchases.state}
              </Chip>
            )}
          </div>
        );

      case "totalproduct":
        return <h3>{purchases.lines.length}</h3>;
      case "taxtotal":
        return <h3>{purchases.taxTotal.toFixed()}</h3>;
      case "total":
        return <h3>{purchases.total.toFixed()}</h3>;
      case "actions":
        return (
          <div className="flex justify-between items-center">
            <div className="relative flex justify-start items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <Icon icon="fluent:grid-dots-28-regular" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    onPress={() => {
                      navigate(`/admin/purchase/detail/${purchases.id}`);
                    }}
                  >
                    View
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            {purchases.state === "pending" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirm(purchases.id);
                }}
                className="px-3 py-1 ml-2 text-white text-sm text-bold bg-blue-700  rounded-md hover:opacity-75"
              >
                confirm
              </button>
            )}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

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
            <h2 className="text-xl font-bold">Purchase Orders</h2>
            <h3 className="text-default-400 text-md pl-4">
              Total {purchases.length}
            </h3>
          </div>

          <div className="flex  items-center">
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
    purchases.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${totalLine} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={totalPages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={isFirstPage}
            size="sm"
            variant="flat"
            onPress={() => !isFirstPage && setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            isDisabled={isLastPage}
            size="sm"
            variant="flat"
            onPress={() => !isLastPage && setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, totalLine, page, isLastPage, isFirstPage, totalPages]);

  const handleConfirm = (id) => {
    setconfrimShowBox(true);
    setConfirmOrderId(id);
  };

  const changeConfirmOrder = async () => {
    await orderConfirmApi(
      `/purchase/${ConfirmOrderId}?state=confirmed`,
      token.accessToken
    );
    refresh();
  };

  const closeBox = () => {
    setconfrimShowBox(false);
  };

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
      <div className="w-96 mx-auto">
        {confrimShowBox && (
          <ConfrimBox
            close={closeBox}
            comfirmHandle={changeConfirmOrder}
            refresh={refresh}
          />
        )}
      </div>
    </>
  );
}
