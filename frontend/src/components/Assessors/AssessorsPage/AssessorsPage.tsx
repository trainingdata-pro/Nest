import React, {HTMLProps, useContext, useEffect, useState} from 'react';
import MyTable from "../../UI/Table";
import AssessorService from "../../../services/AssessorService";
import AddAssessorForm from "../AddAssessorForm";
import Dialog from "../../UI/Dialog";
import Header from "../../Header/Header";
import {useInfiniteQuery, useQuery, useQueryClient} from "react-query";
import {
    createColumnHelper,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel, SortingState,
    useReactTable
} from "@tanstack/react-table";
import {Assessor} from "../../../models/AssessorResponse";
import {useNavigate} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import MyButton from "../../UI/MyButton";
import $api from "../../../http";
import AssessorsManagement from "../AssessorsManagement/AssessorsManagement";
import ChangeProjects from "../AssessorsManagement/ChangeProjects/ChangeProjects";
import TableCheckBox from '../../UI/TableCheckBox';
import AddToProject from "../AssessorsManagement/AddToProjects/AddToProject";
import RemoveAssessorsFromProjects from "../AssessorsManagement/RemoveAssessorsFromProjects/RemoveAssessorsFromProjects";
import {Context} from "../../../index";
import {useMyAssessorsSorting} from "./columns";
import TablePagination from "../../UI/TablePagination";
import Loader from "../../UI/Loader";
import FreeResource from "../../FreeResource/FreeResorces/FreeResource";
import OwnDesires from "../../FreeResource/OwnDesires/OwnDesires";
import PersonalAssessors from "./PersonalAssessors/PersonalAssessors";
import RentAssessors from "./RentAssessors/RentAssessors";


const AssessorsPage = () => {
    const [showSidebar, setShowSidebar] = useState(false)
    const [assessorType, setAssessorsType] = useState('personal')
    return (
        <>
            <Dialog isOpen={showSidebar} setIsOpen={setShowSidebar}>
                <AddAssessorForm assessorId={undefined} project={undefined} setShowSidebar={setShowSidebar}/>
            </Dialog>
            <Header/>
            <div className='mt-20 mx-8 rounded-[8px] pb-[20px]'>
                    <div className='flex justify-between mb-2 space-x-2'>
                        <div className="flex space-x-2 items-center">
                            <MyButton onClick={() => setAssessorsType('personal')}>Привязанные ассессоры</MyButton>
                            <MyButton onClick={() => setAssessorsType('rent')}>Арендованные ассессоры</MyButton>
                        </div>
                        <div className='my-auto'>
                            <p className='my-auto'>{assessorType === 'personal' ? 'Привязанные ассессоры': 'Арендованные ассессоры'}</p>
                        </div>
                        <div className='flex space-x-2 justify-end'>

                            <MyButton onClick={() => setShowSidebar(true)}>Создать асессора</MyButton>
                        </div>
                    </div>
                <div>
                        {assessorType === 'personal' ? <PersonalAssessors/> : <RentAssessors/>}
                </div>
            </div>
        </>
    );
};

export default AssessorsPage;

            {/*// <div>*/}
            {/*//     <Dialog isOpen={showSidebar} setIsOpen={setShowSidebar}>*/}
            {/*//         <AddAssessorForm assessorId={undefined} project={undefined} setShowSidebar={setShowSidebar}/>*/}
            {/*//     </Dialog>*/}
            {/*//*/}
            {/*//     </Dialog>*/}
            {/*//     <Header/>*/}
            {/*//     <div className='pt-20'>*/}
            {/*//         <div className='flex justify-between'>*/}
            {/*//         <nav className='px-8 flex justify-start mb-2 space-x-2'>*/}
            {/*//             <MyButton>Привязанные ассессоры</MyButton>*/}
            {/*//             <MyButton onClick={() => navigate('/dashboard/assessors/rent')}>Арендованные ассессоры</MyButton>*/}
            {/*//         </nav>*/}
            {/*//             <div className='px-8 flex justify-start mb-2 space-x-2'><p className='my-auto'>Привязанные ассессоры</p></div>*/}
            {/*//         <nav className='px-8 flex justify-end mb-2 space-x-2'>*/}
            {/*//             <AssessorsManagement type={'my'} setShowRemoveAssessors={setShowRemoveAssessors}*/}
            {/*//                                  setShowAddProject={setShowAddProject}*/}
            {/*//                                  availableAddProject={getSelectedAssessors().length !== 0}*/}
            {/*//                                  availableChangeProject={getSelectedAssessors().length !== 0}*/}
            {/*//                                  setShowChangeProject={setShowChangeProject}/>*/}
            {/*//             <MyButton onClick={() => setShowSidebar(true)}>Создать асессора</MyButton>*/}
            {/*//         </nav>*/}
            {/*//         </div>*/}
            {/*//         <div className="mx-8 rounded-[20px] bg-white overflow-hidden overflow-x-auto">*/}
            {/*//             <MyTable table={table}/>*/}
            {/*//             <TablePagination totalRows={totalRows} currentPage={currentPage} totalPages={totalPages}*/}
            {/*//                              setCurrentPage={setCurrentPage}/>*/}
            {/*//         </div>*/}
            {/*//*/}
            {/*//     </div>*/}
            {/*// </div>*/}