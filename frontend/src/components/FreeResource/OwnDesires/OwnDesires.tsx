import React from 'react';
import Table from "../../UI/Table";
import {useOwnDesiresSorting} from "./columns";
import {useFetchOwnDesires} from "./queries";

const OwnDesires = ({globalFilter, skillsFilter}: {
    globalFilter: string,
    skillsFilter: string
}) => {
    const {columns, sorting, getSortingString} = useOwnDesiresSorting()
    const {
        fired,
        currentPage,
        setCurrentPage,
        totalPages,
        totalRows,
        pageLimit,
        setPageLimit
    } = useFetchOwnDesires({
        sorting: sorting,
        sortingString: getSortingString(),
        globalFilter: globalFilter,
        skillsFilter: skillsFilter
    })


    return (
        <>
            <Table data={fired.data ? fired.data.results : []} columns={columns} totalRows={totalRows}
                   currentPage={currentPage} totalPages={totalPages}
                   setCurrentPage={setCurrentPage} pageLimit={pageLimit} setPageLimit={setPageLimit}/>
        </>
    );
};

export default OwnDesires;