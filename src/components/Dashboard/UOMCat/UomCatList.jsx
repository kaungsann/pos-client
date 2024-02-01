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
import { deleteMultiple } from "../../Api";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import DeleteAlert from "../../utils/DeleteAlert";

const columns = [
  { name: "Name", uid: "name", sortable: true },
  { name: "Actions", uid: "actions" },
];

export default function UomCatList({ categories, refresh }) {
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(columns.map((column) => column.uid))
  );

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();

  const totalItems = categories.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  const currentPageItems = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return categories.slice(start, end);
  }, [page, categories, rowsPerPage]);

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

  const deleteCategorys = async () => {
    const response = await deleteMultiple(
      "/category",
      {
        categoryIds: [...selectedKeys],
      },
      token.accessToken
    );

    if (response.status) {
      setSelectedKeys([]);
      refresh();
    }
  };

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const renderCell = React.useCallback((category, columnKey) => {
    const cellValue = category[columnKey];

    const renderers = {
      name: () => (
        <User
          avatarProps={{ radius: "full", size: "sm", src: category.image }}
          name={cellValue}
        >
          {category.name}
        </User>
      ),
      actions: () => (
        <div
          className="relative flex justify-start items-center gap-2"
          aria-label="action"
        >
          <Dropdown aria-label="action">
            <DropdownTrigger tabIndex={0}>
              <Button isIconOnly size="sm" variant="light">
                <Icon icon="fluent:grid-dots-28-regular" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="action">
              <DropdownItem
                aria-label={category.name}
                onPress={() => {
                  navigate(`/admin/uom-category/detail/${category._id}`);
                }}
              >
                View
              </DropdownItem>
              <DropdownItem
                aria-label={category.name}
                onPress={() => {
                  navigate(`/admin/uom-category/edit/${category._id}`);
                }}
              >
                Edit
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      ),
    };

    const renderer = renderers[columnKey] || ((value) => value);

    return renderer(cellValue);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <>
        <div className="flex justify-between items-center">
          <div className="flex items-end">
            <h2 className="text-xl font-bold">UOM Categories</h2>
            <h3 className="text-default-400 text-md pl-4">
              Total {categories.length}
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
                aria-label="Table Columns"
                disallowEmptySelection
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} aria-label={column.name}>
                    {column.name}
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
  }, [visibleColumns, onRowsPerPageChange, categories, selectedKeys]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${totalItems} selected`}
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
  }, [selectedKeys, totalItems, page, isLastPage, isFirstPage, totalPages]);

  return (
    <>
      <Table
        aria-label="Category Table"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
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
            <TableRow key={item._id}>
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
            deleteCategorys();
            setShowDeleteBox(false);
          }}
        />
      )}
    </>
  );
}

UomCatList.propTypes = {
  categories: PropTypes.array,
};
