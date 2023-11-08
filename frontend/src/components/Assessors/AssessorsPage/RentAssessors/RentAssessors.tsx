import React from 'react';
import TablePagination from "../../../UI/TablePagination";
import {useMyAssessorsSorting} from "../columns";
import Loader from "../../../UI/Loader";
import AssessorsManagement from "../../AssessorsManagement/AssessorsManagement";
import Select from "react-select";
import {useFetchRentAssessors} from "./queries";
import {useFilterSKills} from "../PersonalAssessors/queries";
import Table from "../../../UI/Table";

const RentAssessors = () => {
    const {columns, sorting, selectedRows, setSelectedRows, getSortingString} = useMyAssessorsSorting()
    const {skills, skillsFilter, onSkillsChange, getValueSkills} = useFilterSKills()
    const {rentAssessors, totalRows, totalPages, setCurrentPage, currentPage, pageLimit, setPageLimit} = useFetchRentAssessors({
        sorting: sorting,
        sortingString: getSortingString(),
        skillsFilter: skillsFilter
    })

    if (rentAssessors.isLoading) return <Loader/>

    return (
        <>
            <div className='flex justify-between'>
                <div className="min-w-[220px]">
                    <Select
                        placeholder='Фильтр по навыкам'
                        options={skills.isSuccess ? skills.data : []}
                        isMulti
                        value={getValueSkills()}
                        isSearchable={false}
                        onChange={onSkillsChange}
                    />

                </div>
                <AssessorsManagement type={'rent'}
                                     availablePopup={true}
                                     setSelectedRow={setSelectedRows}
                                     selectedRows={selectedRows}
                />
            </div>
            <div className='rounded-[20px] bg-white overflow-hidden overflow-x-auto'>
                <Table data={rentAssessors.isSuccess ? rentAssessors.data.results: []}  columns={columns} pages={true} setPageLimit={setPageLimit} pageLimit={pageLimit} totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                       setCurrentPage={setCurrentPage}/>
            </div>
        </>
    );
};

export default RentAssessors;