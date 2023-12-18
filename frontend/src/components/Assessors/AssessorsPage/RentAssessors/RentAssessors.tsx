import React from 'react';
import TablePagination from "../../../UI/TablePagination";
import {useMyAssessorsSorting} from "../columns";
import Loader from "../../../UI/Loader";
import AssessorsManagement from "../../AssessorsManagement/AssessorsManagement";
import Select from "react-select";
import {useFetchRentAssessors} from "./queries";
import {useFilterSKills} from "../PersonalAssessors/queries";
import Table from "../../../UI/Table";
import {useDebounce} from "../../../../hooks/debounce";

const RentAssessors = ({globalFilter, skillsFilter}: {
    globalFilter: string,
    skillsFilter: number[]
}) => {
    const {columns, sorting, selectedRows, setSelectedRows, getSortingString} = useMyAssessorsSorting()
    const {rentAssessors, totalRows, totalPages, setCurrentPage, currentPage, pageLimit, setPageLimit} = useFetchRentAssessors({
        sorting: sorting,
        sortingString: getSortingString(),
        skillsFilter: skillsFilter,
        name: useDebounce(globalFilter)
    })

    if (rentAssessors.isLoading) return <Loader/>

    return (
        <>
            <div className='absolute right-0 top-[-54px] pb-[5px]'>
                <AssessorsManagement type={'rent'}
                                     availablePopup={true}
                                     setSelectedRow={setSelectedRows}
                                     selectedRows={selectedRows}
                />
            </div>
            <div className='rounded-[20px] bg-white overflow-hidden overflow-x-auto'>
                <Table height='h-[calc(100vh-200px)]' data={rentAssessors.isSuccess ? rentAssessors.data.results: []}  columns={columns} setPageLimit={setPageLimit} pageLimit={pageLimit} totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                       setCurrentPage={setCurrentPage}/>
            </div>
        </>
    );
};

export default RentAssessors;