import React, {useState} from 'react';

import AddAssessorForm from "../AssessorForm/AddAssessorForm";
import Dialog from "../../UI/Dialog";
import Header from "../../Header/Header";

import MyButton from "../../UI/MyButton";
import PersonalAssessors from "./PersonalAssessors/PersonalAssessors";
import RentAssessors from "./RentAssessors/RentAssessors";
import Confirm from "../../UI/Confirm";


const AssessorsPage = () => {
    const [showSidebar, setShowSidebar] = useState(false)
    const [assessorType, setAssessorsType] = useState('personal')
    const [isOpenConfirm, setIsOpenConfirm] = useState(false)
    const closeDialog = () => {
        setIsOpenConfirm(true)
    }
    const confirmAction = () => {

    }
    return (
        <>
            <Dialog isOpen={isOpenConfirm} setIsOpen={confirmAction} topLayer={true}>
                <Confirm isCloseConfirm={setIsOpenConfirm} isCloseModal={setShowSidebar}/>
            </Dialog>

            <Dialog isOpen={showSidebar} setIsOpen={closeDialog}>
                <AddAssessorForm project={undefined} setShowSidebar={closeDialog} isOpenModal={setShowSidebar}/>
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
