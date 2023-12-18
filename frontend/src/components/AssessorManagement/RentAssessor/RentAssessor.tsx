import React from 'react';
import {errorNotification} from "../../UI/Notify";
import Table from "../../UI/Table";
import MyButton from "../../UI/MyButton";
import {useFetchProjects, useRentAssessor} from "./queries";
import {useRentAssessorColumns} from "./columns";


const RentAssessor = ({assessorId, show}:{
    assessorId: string | number,
    show: React.Dispatch<boolean>
}) => {
    const {selectedRows, columns} = useRentAssessorColumns()
    const {fetchProjects, currentPage, setCurrentPage, totalPages, totalRows, pageLimit, setPageLimit} = useFetchProjects()
    const {mutate} = useRentAssessor({assessorId:assessorId, show:show, project:selectedRows[0]?.original.id})

    const submit = () => {
        if (selectedRows.length !== 0){
            mutate()
        } else {
            errorNotification('Выберите проект')
        }
    }
    return (
        <div>
                <h1 className='px-4 border-b border-black mb-2'>Аренда ассессора</h1>
                <Table data={fetchProjects.isSuccess ? fetchProjects.data.results : []} columns={columns} pageLimit={pageLimit} setPageLimit={setPageLimit} setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} totalRows={totalRows}/>
                <div className='flex justify-between space-x-2'>
                    <MyButton onClick={() => show(false)}>Назад</MyButton>
                    <MyButton onClick={submit}>Сохранить</MyButton>
                </div>
        </div>
    );
};

export default RentAssessor;