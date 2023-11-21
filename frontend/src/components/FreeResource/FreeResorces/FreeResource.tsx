import React from 'react';
import {IFreeResources} from "../../../models/AssessorResponse";
import Table from "../../UI/Table";
import Loader from "../../UI/Loader";
import {observer} from "mobx-react-lite";
import {useFreeResourcesSorting} from "./columns";
import {useFetchFreeResources} from "./queries";

export interface FreeAssessor extends IFreeResources {
    last_manager: string,
    last_project: string
}

const FreeResource = ({globalFilter, skillsFilter}: {
    globalFilter: string,
    skillsFilter: string
}) => {
    const {columns, sorting, getSortingString} = useFreeResourcesSorting()
    const {
        fetchFreeResources,
        currentPage,
        setCurrentPage,
        totalPages,
        totalRows,
        pageLimit,
        setPageLimit
    } = useFetchFreeResources({
        sorting: sorting,
        sortingString: getSortingString(),
        globalFilter: globalFilter,
        skillsFilter: skillsFilter
    })

    if (fetchFreeResources.isLoading) return <Loader/>
    return (
        <div>
            <Table data={fetchFreeResources.isSuccess ? fetchFreeResources.data.results : []} columns={columns} totalRows={totalRows} currentPage={currentPage}
                   totalPages={totalPages}
                   setCurrentPage={setCurrentPage} pageLimit={pageLimit} setPageLimit={setPageLimit} pages={true}/>
        </div>
    );
};

export default observer(FreeResource);