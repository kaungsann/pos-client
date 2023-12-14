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
  User,
  Pagination,
  Chip,
} from "@nextui-org/react";

import { useNavigate } from "react-router-dom";
import { BASE_URL, deleteMultiple } from "../Api";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import DeleteAlert from "../utils/DeleteAlert";
import { capitalize } from "../utils/utils";
import { format } from "date-fns";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};
const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "expiredate",
  "tax",
  "saleprice",
  "minStockQty",
  "actions",
];

const columns = [
  { name: "Name", uid: "name", sortable: true },
  { name: "ExpireDate", uid: "expiredate", sortable: true },
  { name: "Tax", uid: "tax", sortable: true },
  { name: "SalePrice", uid: "saleprice", sortable: true },
  { name: "PurchasePrice", uid: "purchaseprice", sortable: true },
  { name: "StockQty", uid: "minStockQty", sortable: true },
  { name: "Ref", uid: "ref" },
  { name: "BarCode", uid: "barcode" },
  { name: "Actions", uid: "actions" },
];

export default function ProductList({ products }) {
  const [filterValue, setFilterValue] = React.useState("");
  const [deleteBox, setDeleteBox] = useState(false);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const deleteProducts = async () => {
    const response = await deleteMultiple(
      "/product",
      {
        productIds: [...selectedKeys],
      },
      token.accessToken
    );
    console.log(response);
    if (response.status) {
      setSelectedKeys([]);
    }
  };

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredProduct = [...products];

    if (hasSearchFilter) {
      filteredProduct = filteredProduct.filter((pd) =>
        pd.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredProduct = filteredProduct.filter((pd) =>
        Array.from(statusFilter).includes(pd.name)
      );
    }

    return filteredProduct;
  }, [products, filterValue, statusFilter]);

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

  const renderCell = React.useCallback((products, columnKey) => {
    const cellValue = products[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "full", size: "sm", src: products.image }}
            name={cellValue}
          >
            {products.name}
          </User>
        );
      case "ref":
        return <h1>{products.ref}</h1>;
      case "expiredate":
        return (
          <h1 name={cellValue}>
            {products.expiredAt
              ? format(new Date(products.expiredAt), "yyyy-MM-dd")
              : "none"}
          </h1>
        );
      case "saleprice":
        return <h1> {products.salePrice ? products.salePrice : "none"}</h1>;
      case "purchaseprice":
        return <h1>{products.purchasePrice}</h1>;
      case "minStockQty":
        return <h1 minStockQty={cellValue}>{products.minStockQty}</h1>;
      case "barcode":
        return <h1> {products.barcode ? products.barcode : "none"}</h1>;
      case "actions":
        return (
          <div className=" flex w-full justify-start cursor-pointer items-center h-full z-40">
            <Icon
              onClick={() => {
                navigate(`/admin/products/detail/${products.id}`);
              }}
              icon="fa-solid:eye"
              className="text-2xl hover:text-blue-600 text-slate-500"
            />

            <Icon
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/products/edit/${products.id}`);
              }}
              icon="raphael:edit"
              className="text-2xl ml-2 hover:text-blue-600 text-slate-500"
            />
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
      <>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">Products</h2>
            <h3 className="text-default-400 text-small ml-4">
              Total {products.length}
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
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {selectedKeys.size > 0 && (
              <button
                onClick={() => setDeleteBox(true)}
                className="px-3 py-1.5 text-white bg-rose-500 rounded-md hover:opacity-75"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    products,
    onSearchChange,
    hasSearchFilter,
    selectedKeys,
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
        selectedKeys={selectedKeys}
        selectionMode="multiple"
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
        <TableBody emptyContent={"No Products found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {deleteBox && (
        <DeleteAlert
          cancel={() => {
            setDeleteBox(false);
            setSelectedKeys([]);
          }}
          onDelete={() => {
            deleteProducts();
            setDeleteBox(false);
          }}
        />
      )}
    </>
  );
}
