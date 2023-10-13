import React, {ChangeEvent, useContext, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";
import AssessorService from "../../services/AssessorService";
import {errorNotification, successNotification} from "../UI/Notify";
import ProjectService from "../../services/ProjectService";
import {Context} from "../../index";
import TablePagination from "../UI/TablePagination";


// @ts-ignore
const RentAssessor = ({assessorId, show}) => {
    const queryClient = useQueryClient()
    const {store} = useContext(Context)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageLimit, setPageLimit] = useState(10)
    const {
        data,
        isLoading,
    } = useQuery(['projects', currentPage, pageLimit], () => ProjectService.fetchProjects(currentPage),{
        onSuccess: (data) => {
            setTotalProjects(data.count)
            setCountPages(Math.ceil(data.count/pageLimit))
        },
        keepPreviousData: true
    })
    const [totalProjects, setTotalProjects] = useState<number>(0)
    const [countPages, setCountPages] = useState(1)
    const [selectedProjects, setSelectedProjects] = useState<any[]>([])
    const rentAssessor = useMutation(['assessors'], () => AssessorService.takeFromFreeResource(assessorId, {second_manager: store.user_id, projects: [...selectedProjects]}), {
        onSuccess: () => {
            queryClient.invalidateQueries('assessors')
            queryClient.invalidateQueries('freeResources')
            successNotification('Ассессор успешно арендован')
        },
        onError: () => {
            errorNotification('Произошла ошибка')
        }
    })

    const SelectProject = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value) {
            if (selectedProjects.length === 0){
                setSelectedProjects([event.target.value])
            } else {
                setSelectedProjects([...selectedProjects, event.target.value])
            }
        } else {
            setSelectedProjects(selectedProjects.filter(project => project.toString() !== event.target.value.toString()))
        }
    }
    const submit = () => {
        rentAssessor.mutate()
    }
    const header = ['', 'Asana ID', 'Название проекта', 'Количество исполнителей']

    return (
        <div>
            <div className='w-full'>
                <h1 className='px-4 border-b border-black mb-2'>Аренда ассессора</h1>
                <div className='rounded-[20px] bg-white overflow-hidden pb-4'>
                    <table className="min-w-full text-center">
                        <thead className="">
                        <tr className="bg-[#E7EAFF]">
                            {header.map((col, index) => <th key={index}
                                                            className="border-r dark:border-neutral-500 last:border-none px-[5px] py-[20px]">{col}</th>)}
                        </tr>
                        </thead>
                        <tbody>
                        {data?.results.length !== 0 ? (data?.results.map(project => <tr key={project.id} className="text-center border-t dark:border-neutral-500">
                                <td className="whitespace-pre-wrap border-r dark:border-neutral-500 px-[5px] py-[20px]"><input name='project' value={project.id} onChange={SelectProject} type={"checkbox"}/></td>
                                <td className="whitespace-pre-wrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.asana_id}</td>
                                <td className="break-all border-r max-w-[12rem] dark:border-neutral-500 px-[5px] py-[20px]">{project.name}</td>
                                <td className="whitespace-nowrap border-r dark:border-neutral-500 px-[5px] py-[20px]">{project.assessors_count}</td>
                            </tr>)) :
                            (<tr>
                                <td className="p-4 border-b align-middle [&amp;:has([role=checkbox])]:pr-0 h-24 text-center"
                                    colSpan={20}>Нет результатов
                                </td>
                            </tr>)
                        }
                        </tbody>

                    </table>
                    <TablePagination totalProjects={data?.results.length} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={countPages} pageLimit={pageLimit} setPageLimit={setPageLimit}/>
                </div>
                <div className='flex space-x-2'>
                    <button className='bg-[#5970F6] text-white w-full rounded-md mt-2 py-2'
                            onClick={() => show(false)}>Назад
                    </button>
                    <button className='bg-[#5970F6] text-white w-full rounded-md mt-2 py-2'
                           onClick={submit} >Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RentAssessor;