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
  User,
  Pagination,
  Chip,
} from "@nextui-org/react";

import { statusOptions } from "../Category/data";
import { capitalize } from "../Category/utils";
import SearchBox from "../Category/SearchBox";
import ExcelExportButton from "../../ExcelExportButton";
import ExcelImportButton from "../../ExcelImportButton";
import { useNavigate } from "react-router-dom";
import { BASE_URL, orderConfirmApi } from "../../Api";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import ConfrimBox from "../../utils/ConfrimBox";

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

export default function PurchaseList({ purchases, refresh }) {
  const [filterValue, setFilterValue] = React.useState("");
  const [confrimShowBox, setconfrimShowBox] = React.useState(false);
  const [ConfirmOrderId, setConfirmOrderId] = React.useState(null);

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  console.log("initialized col name is", visibleColumns);

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();

  const addPurchaseRoute = () => {
    navigate("/admin/purchase/create");
  };
  const PURCHASE_API = {
    INDEX: BASE_URL + "/purchase",
    IMPORT: BASE_URL + "/purchase/import-excel",
    EXPORT: BASE_URL + "/purchase/export-excel",
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
        Array.from(statusFilter).includes(pur.status)
      );
    }

    return filteredPurchase;
  }, [purchases, filterValue, statusFilter]);

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

  const renderCell = React.useCallback((purchases, columnKey) => {
    console.log("key is a", columnKey);
    console.log("prucahse is a", purchases);
    const cellValue = purchases[columnKey];

    switch (columnKey) {
      case "orderdate":
        return <h3> {format(new Date(purchases.orderDate), "yyyy-MM-dd")}</h3>;
      case "name":
        return <h3>{purchases.user?.username}</h3>;
      case "partner":
        return <h3>{purchases.partner?.name}</h3>;
      case "location":
        return <h3>{purchases.location?.name}</h3>;
      case "state":
        return (
          <div className="flex gap-4">
            {purchases.state === "pending" ? (
              <Chip color="danger" variant="bordered">
                {purchases.state}
              </Chip>
            ) : (
              <Chip color="success" variant="bordered">
                {purchases.state}
              </Chip>
            )}
          </div>
        );

      case "totalproduct":
        return <h3>{purchases.lines.length}</h3>;
      case "taxtotal":
        return <h3>{purchases.taxTotal}</h3>;
      case "total":
        return <h3>{purchases.total}</h3>;
      case "actions":
        return (
          <div className="flex justify-between items-center">
            <Icon
              icon="mdi:eye-outline"
              onClick={() => {
                navigate(`/admin/purchase/detail/${purchases.id}`);
              }}
              className="text-2xl text-cyan-800 hover:cyan-500 font-bold"
            />
            {purchases.state === "pending" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirm(purchases.id);
                }}
                className="px-4 py-2 ml-2 text-white text-sm text-bold bg-blue-700  rounded-md hover:opacity-75"
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
                apiEndpoint={PURCHASE_API.EXPORT}
              />
            </div>
            <div>
              <ExcelImportButton
                token={token.accessToken}
                apiEndpoint={PURCHASE_API.IMPORT}
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
            <h2 className="text-xl font-bold my-2">Purchases</h2>
            <h3 className="text-default-400 text-small ml-4">
              Total {purchases.length}
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

  const handleConfirm = (id) => {
    setconfrimShowBox(true);
    setConfirmOrderId(id);
  };

  const changeConfirmOrder = async () => {
    const response = await orderConfirmApi(
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
      <div className=" w-96 z-50 fixed top-40 bottom-0 left-0 right-0 mx-auto">
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
