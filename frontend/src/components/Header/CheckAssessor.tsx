import React, {useState} from 'react';
import Dialog from "../UI/Dialog";
import AssessorHistory from "../Assessors/AssessorPage/AssessorHistory/AssessorHistory";
import {useCheckAssessorColumns} from "./columns";
import Table from "../UI/Table";
import {useCheckAssessor} from "./queries";
import Loader from '../UI/Loader';
import MyInput from "../UI/MyInput";
import {useDebounce} from "../../hooks/debounce";


const CheckAssessor = () => {
    const [name, setName] = useState<string>('')
    const [isShowHistory, setIsShowHistory] = useState(false)
    const [idToShow, setIdToShow] = useState(0)
    const {columns} = useCheckAssessorColumns({setIsShowHistory: setIsShowHistory, setIdToShow: setIdToShow})
    const debounce = useDebounce(name)
    const {setCurrentPage,currentPage, totalPages, totalRows, checkAssessors, pageLimit, setPageLimit} = useCheckAssessor({name: debounce})

    return (
        <div className='w-[800px]'>
            <Dialog isOpen={isShowHistory} setIsOpen={setIsShowHistory}>
                <AssessorHistory assessorId={idToShow}/>
            </Dialog>
                <section className="flex justify-between my-2 space-x-2">
                    <div className={'w-full'}>
                        <MyInput value={name} onChange={(event) => setName(event.target.value)}
                        name='name' placeholder="Поиск по ФИО/Ник в ТГ" className="pl-[15px]"/>
                        {name.length <3 && <p className='flex justify-start my-[5px]'>Минимальная длина запроса 3 символа</p>}

                    </div>
                </section>
            <div>
                {checkAssessors.isFetching ? <Loader height='h-[300px]'/> :

                    <Table data={name.length >= 3 && checkAssessors.isSuccess ? checkAssessors.data.results : []} columns={columns} totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}
                           setCurrentPage={setCurrentPage} pageLimit={pageLimit} setPageLimit={setPageLimit} pages={true}/>

            }
            </div>
        </div>
    );
};

export default CheckAssessor;