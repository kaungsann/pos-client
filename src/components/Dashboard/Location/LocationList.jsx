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
  Chip,
  User,
  Pagination,
} from "@nextui-org/react";

import { statusOptions } from "../Category/data";
import { capitalize } from "../Category/utils";
import SearchBox from "../Category/SearchBox";
import ExcelExportButton from "../../ExcelExportButton";
import ExcelImportButton from "../../ExcelImportButton";
import { useNavigate } from "react-router-dom";
import { BASE_URL, deleteMultiple } from "../../Api";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import DeleteAlert from "../../utils/DeleteAlert";
import { Icon } from "@iconify/react";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "create", "update", "actions"];

const columns = [
  { name: "Name", uid: "name", sortable: true },
  { name: "Create-Date", uid: "create" },
  { name: "Update ", uid: "update" },
  { name: "ACTIONS00", uid: "actions" },
];

export default function LocationList({ locations, onDeleteSuccess }) {
  const [deleteBox, setDeleteBox] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();
  const addLocationRoute = () => {
    navigate("/admin/locations/create");
  };
  const LOCATION_API = {
    INDEX: BASE_URL + "/location",
    IMPORT: BASE_URL + "/location/import-excel",
    EXPORT: BASE_URL + "/location/export-excel",
  };

  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
    let filteredLocation = [...locations];

    if (hasSearchFilter) {
      filteredLocation = filteredLocation.filter((loca) =>
        loca.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredLocation = filteredLocation.filter((loca) =>
        Array.from(statusFilter).includes(loca.status)
      );
    }

    return filteredLocation;
  }, [locations, filterValue, statusFilter]);

  console.log("filter items is a", filteredItems);

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

  const renderCell = React.useCallback((locations, columnKey) => {
    const cellValue = locations[columnKey];

    switch (columnKey) {
      case "name":
        return <h3>{locations.name}</h3>;
      case "create":
        return <h3>{format(new Date(locations.createdAt), "yyyy-MM-dd")}</h3>;
      case "update":
        return <h3>{format(new Date(locations.updatedAt), "yyyy-MM-dd")}</h3>;
      case "actions":
        return (
          <div className="p-2 flex w-full justify-start items-center">
            <Icon
              icon="prime:eye"
              className="text-xl hover:opacity-75"
              onClick={() => {
                navigate(`/admin/locations/detail/${locations.id}`);
              }}
            />
            <Icon
              icon="ep:edit"
              className="text-lg ml-2 hover:opacity-75"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/locations/edit/${locations.id}`);
              }}
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
          <SearchBox
            value={filterValue}
            clear={onClear}
            changeValue={onSearchChange}
          />
          <div className="flex">
            <button
              onClick={addLocationRoute}
              className="font-bold rounded-sm shadow-sm flex items-center text-blue-700 border-blue-500 border-2 hover:opacity-75 text-sm hover:text-white hover:bg-blue-700 px-3 py-1.5"
            >
              Add
            </button>
            <div className="mx-3">
              <ExcelExportButton
                token={token.accessToken}
                apiEndpoint={LOCATION_API.EXPORT}
              />
            </div>
            <div>
              <ExcelImportButton
                token={token.accessToken}
                apiEndpoint={LOCATION_API.IMPORT}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center ">
            <h2 className="text-xl font-bold">Location</h2>
            <h3 className="text-default-400 text-small ml-4">
              Total {locations.length}
            </h3>
          </div>
          <div className="flex">
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
            {selectedKeys.size > 0 && (
              <button
                onClick={() => setDeleteBox(true)}
                className="ml-12 px-3 py-1.5 text-white bg-rose-500 rounded-md hover:opacity-75"
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
    locations.length,
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

  const deleteLocations = async () => {
    const response = await deleteMultiple(
      "/location",
      {
        locationIds: [...selectedKeys],
      },
      token.accessToken
    );
    if (response.status) {
      setSelectedKeys([]);
      onDeleteSuccess();
    }
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
        <TableBody emptyContent={"No Location found"} items={sortedItems}>
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
            deleteLocations();
            setDeleteBox(false);
          }}
        />
      )}
    </>
  );
}
