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

const LocationList = ({ locations }) => {
    const navigate = useNavigate();

    const editRoute = (id) => {
        navigate(`/admin/location/edit/${id}`);
    };

    return (
        <>
            <div>
                <h2 className="lg:text-xl font-bold my-2">Location</h2>
                <Table aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>Name</TableColumn>
                   
                    </TableHeader>
                    <TableBody>
                        {locations ? (
                            locations.map((location) => (
                                <TableRow key={location.id} className="items-center">
                                    <TableCell>{location.name}</TableCell>
                                  
                                   
                                  
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Icon
                                                icon="prime:eye"
                                                onClick={() =>
                                                    navigate(`/admin/location/detail/${location.id}`)
                                                }
                                                className="text-xl"
                                            />
                                            <Icon
                                                icon="ep:edit"
                                                className="text-lg ml-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    editRoute(location.id);
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

LocationList.propTypes = {
    locations: PropTypes.array,
};

export default LocationList;
