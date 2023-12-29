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
import SearchBox from "../utils/SearchBox";
import { useNavigate } from "react-router-dom";
import { BASE_URL, deleteMultiple } from "../Api";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import DeleteAlert from "../utils/DeleteAlert";
import ChangePassword from "../utils/ChangePassword";

let INITIAL_VISIBLE_COLUMNS = ["role", "name", "email", "lastlogin", "actions"];

let columns = [
  { name: "Role", uid: "role" },
  { name: "Name", uid: "username", sortable: true },
  { name: "Email", uid: "email" },
  { name: "Phone", uid: "phone" },
  { name: "Address", uid: "address" },
  { name: "Gender", uid: "gender" },
  { name: "City", uid: "city" },
  { name: "DateOfBirth", uid: "birthdate" },
  { name: "Actions", uid: "actions" },
];

export default function StaffList({ staffs, onDeleteSuccess }) {
  const [deleteBox, setDeleteBox] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const [userId, setUserId] = React.useState(null);
  const [show, setShow] = React.useState(false);

  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const closeShowBox = (text) => {
    setShow(text);
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

  const deleteStaffs = async () => {
    const response = await deleteMultiple(
      "/user",
      {
        userIds: [...selectedKeys],
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

    switch (columnKey) {
      case "username":
        return (
          <User
            name={cellValue}
          >
            {staffs.username}
          </User>
        );
      case "role":
        return <h3>{staffs.role ? staffs.role.name : "none"}</h3>;
      case "birthdate":
        return (
          <h3>
            {staffs.birthdate
              ? new Date(staffs.birthdate).toLocaleDateString()
              : ""}
          </h3>
        );
      case "actions":
        return (
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
                    navigate(`/admin/user/detail/${staffs._id}`);
                  }}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  onPress={() => {
                    navigate(`/admin/user/edit/${staffs._id}`);
                  }}
                >
                  Edit
                </DropdownItem>

                <DropdownItem
                  onPress={() => {
                    setShow(true);
                    setUserId(staffs._id);
                  }}
                >
                  Password
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
        <div className="flex justify-between items-center">
          

          <div className="flex items-end">
            <h2 className="text-xl font-bold">Staff</h2>
            <h3 className="text-default-400 text-md pl-4">
              Total {staffs.length}
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
                  <Icon icon="system-uicons:filtering" className="mx-4" />
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
            {selectedKeys.size > 0 && (
              <button
                onClick={() => setDeleteBox(true)}
                className="px-3 py-1 text-white bg-rose-500 rounded-md hover:opacity-75"
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
  console.log(staffs);
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
      {show && <ChangePassword id={userId} close={closeShowBox} />}

      {deleteBox && (
        <DeleteAlert
          cancel={() => {
            setDeleteBox(false);
            setSelectedKeys([]);
          }}
          onDelete={() => {
            deleteStaffs();
            setDeleteBox(false);
          }}
        />
      )}
    </>
  );
}
