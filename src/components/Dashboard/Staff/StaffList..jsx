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
import { Icon } from "@iconify/react";
import { statusOptions } from "../Category/data";
import { capitalize } from "../Category/utils";
import SearchBox from "../../utils/SearchBox";
import { useNavigate } from "react-router-dom";
import { BASE_URL, deleteMultiple } from "../../Api";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import DeleteAlert from "../../utils/DeleteAlert";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

let INITIAL_VISIBLE_COLUMNS = ["role", "name", "email", "lastlogin", "actions"];

let columns = [
  { name: "ROLE", uid: "role", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "LAST-LOGIN", uid: "lastlogin", sortable: true },
  { name: "PHONE", uid: "phone" },
  { name: "ADDRESS", uid: "address" },
  { name: "GENDER", uid: "gender" },
  { name: "CITY", uid: "city" },
  { name: "DATEOFBIRTH", uid: "birthdate" },
  { name: "ACTIONS", uid: "actions" },
];

export default function StaffList({ staffs, onDeleteSuccess }) {
  console.log("staff is a", staffs);
  const [deleteBox, setDeleteBox] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const PARTNER_API = {
    INDEX: BASE_URL + "/employee",
  };

  const token = useSelector((state) => state.IduniqueData);
  const navigate = useNavigate();
  const addCEmployeeRoute = () => {
    navigate("/admin/employee/create");
  };

  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const deleteCateogrys = async () => {
    const response = await deleteMultiple(
      "/employee",
      {
        employeeIds: [...selectedKeys],
      },
      token.accessToken
    );
    if (response.status) {
      setSelectedKeys([]);
      onDeleteSuccess();
    }
  };

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  console.log("table head is a", headerColumns);

  const filteredItems = React.useMemo(() => {
    let filteredStaff = [...staffs];

    if (hasSearchFilter) {
      filteredStaff = filteredStaff.filter((staff) =>
        staff.username.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredStaff = filteredStaff.filter((staff) =>
        Array.from(statusFilter).includes(staff.status)
      );
    }
    console.log("FILTERstaff is a", filteredStaff);
    return filteredStaff;
  }, [staffs, filterValue, statusFilter]);

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

  const renderCell = React.useCallback((staffs, columnKey) => {
    const cellValue = staffs[columnKey];

    console.log("cell value is a", cellValue);
    console.log(" columnKey is a", columnKey);

    switch (columnKey) {
      case "role":
        // {staffs.role ? staffs.role.name : "none"}
        return <User name={cellValue.name}>{cellValue.name}</User>;
      case "name":
        return <h3>{staffs.username}</h3>;
      case "email":
        return <h3>{staffs.email}</h3>;
      case "lastlogin":
        return <h3>{format(new Date(staffs.lastLogin), "yyyy-MM-dd")}</h3>;
      case "phone":
        return <h3>{staffs.phone ? staffs.phone : "no phone"}</h3>;
      case "address":
        return <h3>{staffs.address ? staffs.address : "no address"}</h3>;
      case "gender":
        return <h3>{staffs.gender ? staffs.gender : "no gender"}</h3>;
      case "city":
        return <h3>{staffs.city ? staffs.city : "no city"}</h3>;
      case "birthdate":
        return (
          <h3>{staffs.birthdate ? staffs.birthdate : "no dateofbirth"}</h3>
        );
      case "actions":
        return (
          <div className="p-2 flex w-full justify-start">
            <Icon
              icon="mdi:eye-outline"
              onClick={() => {
                navigate(`/admin/employee/detail/${staffs._id}`);
              }}
              className="text-2xl text-cyan-800 hover:cyan-500 font-bold"
            />
            <Icon
              icon="ep:edit"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/employee/edit/${staffs._id}`);
              }}
              className="text-2xl mx-3 text-blue-800 font-bold hover:text-blue-500"
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
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <SearchBox
            value={filterValue}
            clear={onClear}
            changeValue={onSearchChange}
          />

          <div className="flex gap-3">
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
              onClick={addCEmployeeRoute}
              className="text-white bg-blue-600 rounded-sm py-1.5 px-4 hover:opacity-75"
            >
              Add New
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h2 className="text-xl font-bold my-2">staffs</h2>
            <h3 className="text-default-400 text-small ml-4">
              Total {staffs.length}
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
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    staffs.length,
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
        <TableBody emptyContent={"No staffs found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item._id}>
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
            deleteCateogrys();
            setDeleteBox(false);
          }}
        />
      )}
    </>
  );
}
