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
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { orderConfirmApi } from "../../Api";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import ConfrimBox from "../../utils/ConfrimBox";

const INITIAL_VISIBLE_COLUMNS = [
  "scheduledate",
  "user",
  "partner",
  "location",
  "state",
  "totalqty",
  "total",
  "orderref",
  "actions",
];

const columns = [
  { name: "Schedule Date", uid: "scheduledate" },
  { name: "User", uid: "user" },
  { name: "Partner", uid: "partner", sortable: true },
  { name: "Location", uid: "location", sortable: true },
  { name: "State", uid: "state" },
  { name: "Item", uid: "totalproduct", sortable: true },
  { name: "Total Qty", uid: "totalqty", sortable: true },
  { name: "Total", uid: "total", sortable: true },
  { name: "Order Ref", uid: "orderref" },
  { name: "Action", uid: "actions" },
];

export default function PurchaseList({ orders, refresh }) {
  const [confrimShowBox, setconfrimShowBox] = React.useState(false);
  const [ConfirmOrderId, setConfirmOrderId] = React.useState(null);

  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();

  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);
  const totalLine = orders.length;
  const totalPages = Math.ceil(totalLine / rowsPerPage);
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return INITIAL_VISIBLE_COLUMNS;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredPurchase = [...orders];

    return filteredPurchase;
  }, [orders]);

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

  const renderCell = React.useCallback((orders, columnKey) => {
    const cellValue = orders[columnKey];

    switch (columnKey) {
      case "scheduledate":
        return <h3> {format(new Date(orders.orderDate), "yyyy-MM-dd")}</h3>;
      case "user":
        return <h3>{orders.user?.username}</h3>;
      case "partner":
        return <h3>{orders.partner?.name}</h3>;
      case "location":
        return <h3>{orders.location?.name}</h3>;
      case "orderref":
        return <h3>{orders.orderRef}</h3>;
      case "state":
        return (
          <div className="flex gap-4 w-24">
            {orders.state === "pending" ? (
              <Chip
                color="danger"
                variant="bordered"
                className="bg-red-50 w-full"
              >
                {orders.state}
              </Chip>
            ) : (
              <Chip
                color="success"
                variant="bordered"
                className="bg-green-50 px-2 w-full"
              >
                {orders.state}
              </Chip>
            )}
          </div>
        );

      case "totalproduct":
        return <h3>{orders.lines.length}</h3>;
      case "totalqty":
        return (
          <h3>
            {orders.lines.reduce(
              (accumulator, currentValue) => accumulator + currentValue.qty,
              0
            )}
          </h3>
        );
      case "total":
        return <h3>{orders.total - orders.taxTotal}</h3>;
      case "actions":
        return (
          <div
            className="flex justify-between items-center"
            aria-label="Dynamic Actions"
          >
            <div className="relative flex justify-start items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <Icon icon="fluent:grid-dots-28-regular" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Dynamic Actions">
                  <DropdownItem
                    onPress={() => {
                      navigate(`/admin/purchase/detail/${orders.id}`);
                    }}
                  >
                    View
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            {orders.state === "pending" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirm(orders.id);
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

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-end">
            <h2 className="text-xl font-bold">Purchase Orders</h2>
            <h3 className="text-default-400 text-md pl-4">
              Total {orders.length}
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
  }, [visibleColumns, onRowsPerPageChange, orders.length]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400"></span>
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
  }, [page, isLastPage, isFirstPage, totalPages]);

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
        <TableBody emptyContent={"No Record"} items={sortedItems}>
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

PurchaseList.propTypes = {
  orders: PropTypes.array,
  refresh: PropTypes.func,
};
