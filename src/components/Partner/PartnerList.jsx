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

const PartnerList = ({ partners }) => {
    const navigate = useNavigate();

    const editRoute = (id) => {
        navigate(`/admin/partner/edit/${id}`);
    };

    return (
        <>
            <div>
                <h2 className="lg:text-xl font-bold my-2">partners</h2>
                <Table aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Address</TableColumn>
                        <TableColumn>City</TableColumn>
                        <TableColumn>Phone</TableColumn>
                        <TableColumn>Date</TableColumn>
                        <TableColumn>Desc</TableColumn>
                        <TableColumn>Company</TableColumn>
                        <TableColumn>Action</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {partners ? (
                            partners.map((partner) => (
                                <TableRow key={partner.id} className="items-center">
                                    <TableCell>{partner.name}</TableCell>
                                    <TableCell>{partner.address}</TableCell>
                                    <TableCell>{partner.phone ? partner.phone : "none"}</TableCell>
                                    <TableCell>
                                        {partner.date ? partner.date : "none"}
                                    </TableCell>
                                    <TableCell>
                                        {partner.description
                                            ? partner.description.substring(0, 30)
                                            : "none"}
                                    </TableCell>
                                    <TableCell>
                                        {partner.company ? partner.company : "none"}
                                    </TableCell>
                                    <TableCell>
                                        {partner.salePrice ? partner.salePrice : "none"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Icon
                                                icon="prime:eye"
                                                onClick={() =>
                                                    navigate(`/admin/partners/detail/${partner.id}`)
                                                }
                                                className="text-xl"
                                            />
                                            <Icon
                                                icon="ep:edit"
                                                className="text-lg ml-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    editRoute(partner.id);
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

PartnerList.propTypes = {
    partners: PropTypes.array,
};

export default PartnerList;
