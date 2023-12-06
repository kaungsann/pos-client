import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@nextui-org/react";

const EmployeeList = ({ employees }) => {
    const navigate = useNavigate();

    const editRoute = (id) => {
        navigate(`/admin/user/edit/${id}`);
    };

    return (
        <>
            <div>
                <h2 className="lg:text-xl font-bold my-2">employees</h2>
                <Table aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Email</TableColumn>
                        <TableColumn>Role</TableColumn>

                  
                    </TableHeader>
                    <TableBody>
                        {employees ? (
                            employees.map((employee) => (
                                <TableRow key={employee.id} className="items-center">
                                    <TableCell>{employee.name}</TableCell>
                                    <TableCell>{employee.address}</TableCell>
                                    <TableCell>{employee.phone ? employee.phone : "none"}</TableCell>
                                    <TableCell>
                                        {employee.date ? employee.date : "none"}
                                    </TableCell>
                                    <TableCell>
                                        {employee.description
                                            ? employee.description.substring(0, 30)
                                            : "none"}
                                    </TableCell>
                                    <TableCell>
                                        {employee.company ? employee.company : "none"}
                                    </TableCell>
                                    <TableCell>
                                        {employee.salePrice ? employee.salePrice : "none"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Icon
                                                icon="prime:eye"
                                                onClick={() =>
                                                    navigate(`/admin/user/detail/${employee.id}`)
                                                }
                                                className="text-xl"
                                            />
                                            <Icon
                                                icon="ep:edit"
                                                className="text-lg ml-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    editRoute(employee.id);
                                                }}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <Spinner />
                        )}
                    </TableBody>
                </Table>
                <Spinner className="text-center w-full mt-52" />
            </div>
        </>
    );
};

EmployeeList.propTypes = {
    employees: PropTypes.array,
};

export default EmployeeList;
