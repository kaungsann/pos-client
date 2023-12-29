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
import { format } from "date-fns";

const columns = [
  { name: "Product", uid: "productName", sortable: true },
  { name: "Location", uid: "locationName", sortable: true },
  { name: "Date", uid: "updatedAt", sortable: true },
  { name: "Barcode", uid: "productBarcode" },
  { name: "Quantity", uid: "quantity", sortable: true },
];

export default function AdjustmentList({ adjustments }) {
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(columns.map((column) => column.uid))
  );

  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();

  const totalProducts = adjustments.length;
  const totalPages = Math.ceil(totalProducts / rowsPerPage);
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  const currentPageItems = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return adjustments.slice(start, end);
  }, [page, adjustments, rowsPerPage]);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const sortedItems = React.useMemo(() => {
    return currentPageItems.sort((a, b) => {
      const first = a[sortDescriptor.column] || "";
      const second = b[sortDescriptor.column] || "";
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, currentPageItems]);

  const deleteProducts = async () => {
    const response = await deleteMultiple(
      "/adjustment",
      {
        adjustmentId: [...selectedKeys],
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

  const renderCell = React.useCallback(
    (adjustment, columnKey) => {
      const cellValue = adjustment[columnKey];

      const renderers = {
        name: () => (
          <User
            avatarProps={{ radius: "full", size: "sm", src: adjustment.image }}
            name={cellValue}
          >
            {adjustment.name}
          </User>
        ),
        updatedAt: () => (
          <h1>{format(new Date(adjustment.updatedAt), "yyyy-MM-dd")}</h1>
        ),
        actions: () => (
          <div className="p-2 flex w-full justify-start cursor-pointer">
            <Icon
              icon="prime:eye"
              className="text-2xl hover:opacity-75"
              onClick={() => {
                navigate(`/admin/adjustments/detail/${adjustment.id}`);
              }}
            />
          </div>
        ),
      };

      const renderer = renderers[columnKey] || ((value) => value);

      return renderer(cellValue);
    },
    [adjustments]
  );

  const topContent = React.useMemo(() => {
    return (
      <>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">Adjustments</h2>
            <h3 className="text-default-400 text-small ml-4">
              Total {adjustments.length}
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
  }, [visibleColumns, onRowsPerPageChange, adjustments, selectedKeys]);

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

  (sortedItems);

  return (
    <>
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={(descriptor) => setSortDescriptor(descriptor)}
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
    </>
  );
}

AdjustmentList.propTypes = {
  adjustments: PropTypes.array,
};
