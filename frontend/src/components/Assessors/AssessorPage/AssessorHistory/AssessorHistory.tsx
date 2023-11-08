import React from 'react';
import {useHistoryColumns} from "./columns";
import Table from "../../../UI/Table";
import {useAssessorHistory} from "./queries";
import Loader from "../../../UI/Loader";


const AssessorHistory = ({assessorId}: {
    assessorId: number | string | undefined
}) => {

    const {currentPage, setCurrentPage, totalPages, totalRows, history, pageLimit, setPageLimit} = useAssessorHistory({assessorId: assessorId})
    const {columns} = useHistoryColumns()
    if (history.isLoading) return <div className='min-w-[500px]'><Loader/></div>
    return (
        <>
            <div className='w-full after:border-b after:border-black'>
                <h1 className='my-2 text-[18px]'>История</h1>
            </div>
            <Table data={history.isSuccess ? history.data.results : []} columns={columns} totalRows={totalRows}
                   currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} pages={true} pageLimit={pageLimit} setPageLimit={setPageLimit}/>
        </>
    );
};

export default AssessorHistory;