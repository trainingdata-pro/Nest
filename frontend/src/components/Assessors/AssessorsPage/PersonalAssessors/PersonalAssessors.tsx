import React from 'react';
import {useMyAssessorsSorting} from "../columns";
import TablePagination from "../../../UI/TablePagination";
import Loader from "../../../UI/Loader";
import AssessorsManagement from "../../AssessorsManagement/AssessorsManagement";
import Select from "react-select";
import {useFetchAssessors, useFilterSKills} from "./queries";
import Table from "../../../UI/Table";

const PersonalAssessors = () => {
    const {columns, sorting, selectedRows, getSortingString, setSelectedRows} = useMyAssessorsSorting()
    const {skills, skillsFilter, onSkillsChange, getValueSkills} = useFilterSKills()
    const {assessors, totalRows, totalPages, setCurrentPage, currentPage, pageLimit, setPageLimit} = useFetchAssessors({
        sorting: sorting,
        sortingString: getSortingString(),
        skillsFilter: skillsFilter
    })

    if (assessors.isLoading) return <Loader/>
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
                <AssessorsManagement type={'personal'}
                                     availablePopup={selectedRows.length !== 0}
                                     setSelectedRow={setSelectedRows}
                                     selectedRows={selectedRows}
                />
            </div>
            <div className='rounded-[20px] bg-white overflow-hidden overflow-x-auto'>
                <Table data={assessors.isSuccess ? assessors.data.results: []}  columns={columns} pages={true} setPageLimit={setPageLimit} pageLimit={pageLimit} totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                       setCurrentPage={setCurrentPage}/>
            </div>
        </>
    );
};

export default PersonalAssessors;