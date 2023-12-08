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

const CustomerList = ({ customers }) => {
    const navigate = useNavigate();

    const editRoute = (id) => {
        navigate(`/admin/partner/edit/${id}`);
    };

    return (
        <>
            <div>
                <h2 className="lg:text-xl font-bold my-2">customers</h2>
                <Table aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Address</TableColumn>
                        <TableColumn>City</TableColumn>
                        <TableColumn>Phone</TableColumn>
                        <TableColumn>Date</TableColumn>
                        <TableColumn>Company</TableColumn>
                        <TableColumn>Action</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {customers ? (
                            customers.map((customers) => (
                                <TableRow key={customers.id} className="items-center">
                                    <TableCell>{customers.name}</TableCell>
                                    <TableCell>{customers.address}</TableCell>
                                    <TableCell>{customers.phone ? customers.phone : "none"}</TableCell>
                                    <TableCell>
                                        {customers.date ? customers.date : "none"}
                                    </TableCell>
                                
                                    <TableCell>
                                        {customers.company ? customers.company : "none"}
                                    </TableCell>
                                    <TableCell>
                                        {customers.salePrice ? customers.salePrice : "none"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Icon
                                                icon="prime:eye"
                                                onClick={() =>
                                                    navigate(`/admin/partner/detail/${customers.id}`)
                                                }
                                                className="text-xl"
                                            />
                                            <Icon
                                                icon="ep:edit"
                                                className="text-lg ml-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    editRoute(customers.id);
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

CustomerList.propTypes = {
    customers: PropTypes.array,
};

export default CustomerList;
