import React from 'react';
import TablePagination from "../../../UI/TablePagination";
import {useMyAssessorsSorting} from "../columns";
import Loader from "../../../UI/Loader";
import AssessorsManagement from "../../AssessorsManagement/AssessorsManagement";
import Select from "react-select";
import {useFetchRentAssessors} from "./queries";
import {useFilterSKills} from "../PersonalAssessors/queries";
import NewTable from "../../../UI/NewTable";

const RentAssessors = () => {
    const {columns, sorting, selectedRows, setSelectedRows, getSortingString} = useMyAssessorsSorting()
    const {skills, skillsFilter, onSkillsChange, getValueSkills} = useFilterSKills()
    const {rentAssessors, totalRows, totalPages, setCurrentPage, currentPage} = useFetchRentAssessors({
        sorting: sorting,
        sortingString: getSortingString(),
        skillsFilter: skillsFilter
    })

    if (rentAssessors.isLoading) return <Loader width={30}/>

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
                <NewTable data={rentAssessors.isSuccess ? rentAssessors.data.results : []} columns={columns}/>
                <TablePagination
                    totalRows={totalRows}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}/>
            </div>
        </>
    );
};

export default RentAssessors;