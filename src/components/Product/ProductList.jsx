import React, { useState } from "react";
import PropTypes from "prop-types";
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
} from "@nextui-org/react";

import { useNavigate } from "react-router-dom";
import { deleteMultiple } from "../Api";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import DeleteAlert from "../utils/DeleteAlert";
import { capitalize } from "../utils/utils";
import { format } from "date-fns";

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
  { name: "Expired Date", uid: "expiredate", sortable: true },
  { name: "Tax", uid: "tax", sortable: true },
  { name: "Sale Price", uid: "saleprice", sortable: true },
  { name: "Purchase Price", uid: "purchaseprice", sortable: true },
  { name: "Min-Stock Qty", uid: "minStockQty", sortable: true },
  { name: "Ref", uid: "ref" },
  { name: "Barcode", uid: "barcode" },
  { name: "Actions", uid: "actions" },
];

export default function ProductList({ products }) {
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();

  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / rowsPerPage);
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  const currentPageItems = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return products.slice(start, end);
  }, [page, products, rowsPerPage]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const sortedItems = React.useMemo(() => {
    return [...currentPageItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, currentPageItems]);

  const deleteProducts = async () => {
    const response = await deleteMultiple(
      "/product",
      {
        productIds: [...selectedKeys],
      },
      token.accessToken
    );
    if (response.status) {
      setSelectedKeys([]);
    }
  };

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

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
        return <h1>{products.minStockQty}</h1>;
      case "barcode":
        return <h1> {products.barcode}</h1>;
      case "actions":
        return (
          <div className="p-2 flex w-full justify-start cursor-pointer">
            <Icon
              icon="prime:eye"
              className="text-xl hover:opacity-75"
              onClick={() => {
                navigate(`/admin/products/detail/${products.id}`);
              }}
            />
            <Icon
              icon="ep:edit"
              className="text-lg ml-2 hover:opacity-75"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/products/edit/${products.id}`);
              }}
            />
          </div>
        );
      default:
        return cellValue;
    }
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
                onClick={() => setShowDeleteBox(true)}
                className="px-3 py-1.5 text-white bg-rose-500 rounded-md hover:opacity-75"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </>
    );
  }, [visibleColumns, onRowsPerPageChange, products, selectedKeys]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${totalProducts} selected`}
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
  }, [selectedKeys, totalProducts, page, isLastPage, isFirstPage, totalPages]);

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
        <TableBody emptyContent={"No Product found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {showDeleteBox && (
        <DeleteAlert
          cancel={() => {
            setShowDeleteBox(false);
            setSelectedKeys(new Set([]));
          }}
          onDelete={() => {
            deleteProducts();
            setShowDeleteBox(false);
          }}
        />
      )}
    </>
  );
}

ProductList.propTypes = {
  products: PropTypes.array,
};
