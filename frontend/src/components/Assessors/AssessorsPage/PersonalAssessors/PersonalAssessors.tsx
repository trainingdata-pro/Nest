import React from 'react';
import {useMyAssessorsSorting} from "../columns";
import TablePagination from "../../../UI/TablePagination";
import Loader from "../../../UI/Loader";
import AssessorsManagement from "../../AssessorsManagement/AssessorsManagement";
import Select from "react-select";
import {useFetchAssessors, useFilterSKills} from "./queries";
import NewTable from "../../../UI/NewTable";

const PersonalAssessors = () => {
    const {columns, sorting, selectedRows, getSortingString, setSelectedRows} = useMyAssessorsSorting()
    const {skills, skillsFilter, onSkillsChange, getValueSkills} = useFilterSKills()
    const {assessors, totalRows, totalPages, setCurrentPage, currentPage} = useFetchAssessors({
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
                <NewTable data={assessors.isSuccess ? assessors.data.results : []} columns={columns} />
                <TablePagination
                    totalRows={totalRows}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}/>
            </div>
        </>
    );
};

export default PersonalAssessors;