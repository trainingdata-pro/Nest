import React from 'react';
import {useMyAssessorsSorting} from "../columns";
import TablePagination from "../../../UI/TablePagination";
import Loader from "../../../UI/Loader";
import AssessorsManagement from "../../AssessorsManagement/AssessorsManagement";
import Select from "react-select";
import {useFetchAssessors, useFilterSKills} from "./queries";
import Table from "../../../UI/Table";
import {useDebounce} from "../../../../hooks/debounce";

const PersonalAssessors = ({globalFilter, skillsFilter}: {
    globalFilter: string,
    skillsFilter:number[]
}) => {
    const {columns, sorting, selectedRows, getSortingString, setSelectedRows} = useMyAssessorsSorting()
    const {assessors, totalRows, totalPages, setCurrentPage, currentPage, pageLimit, setPageLimit} = useFetchAssessors({
        sorting: sorting,
        sortingString: getSortingString(),
        skillsFilter: skillsFilter,
        name: useDebounce(globalFilter)
    })

    if (assessors.isLoading) return <Loader/>
    return (
        <>
            <div className='absolute right-0 top-[-54px]'>
                <AssessorsManagement type={'personal'}
                                     availablePopup={selectedRows.length !== 0}
                                     setSelectedRow={setSelectedRows}
                                     selectedRows={selectedRows}
                />
            </div>
            <div className='rounded-[20px] bg-white overflow-hidden overflow-x-auto'>
                <Table height='h-[calc(100vh-200px)]' data={assessors.isSuccess ? assessors.data.results: []}  columns={columns} setPageLimit={setPageLimit} pageLimit={pageLimit} totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                       setCurrentPage={setCurrentPage}/>
            </div>
        </>
    );
};

export default PersonalAssessors;