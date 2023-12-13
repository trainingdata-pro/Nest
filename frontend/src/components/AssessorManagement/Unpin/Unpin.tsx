import React, {useState} from 'react';
import MyButton from "../../UI/MyButton";
import {errorNotification} from "../../UI/Notify";
import Select from "react-select";
import {useUnpin} from "./queries";
import {Assessor} from "../../../models/AssessorResponse";
import {useAvailableManagers} from "./hooks";
import Dialog from "../../UI/Dialog";
import {Props} from "../Management";

interface UnpinProps extends Props{
    assessor: Assessor,

}
const Unpin = ({assessorId, assessor, setIsOpenDropDown, ...props}:UnpinProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const handleClick = () => {
        setIsOpenDropDown(false)
        setIsOpen(true)
    }
    const [selectedReason, setSelectedReason] = useState<string>()
    const {mutate} = useUnpin({close: setIsOpen})
    const {selectedManager, availableManagers, onChangeManager, getValueManager} = useAvailableManagers({assessor})
    const submit = ()=> {

        if (selectedReason){
            if (availableManagers?.length === 0){
                mutate({assessorId: assessor.id, data: {reason: selectedReason}})
            } else {
                if (selectedManager){
                    mutate({assessorId:assessor.id,data: {reason: selectedReason, manager: selectedManager}})
                } else {
                    errorNotification('Выберите менеджера, которому перейдет асессор')
                }
            }
        } else {
            errorNotification('Выберите причину')
        }

    }

    return (
        <>
            <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
                <div>
                    <div className='border-b border-black w-full'>
                        <h1 className='px-4'>Открепить от себя</h1>
                    </div>
                    <div className='flex justify-start'>
                        <input name='reason' onChange={(event) => setSelectedReason(event.target.value)} id='reason1' type="radio" value='project'/>
                        <label className='pl-[4px]' htmlFor='reason1'>Не смог работать со спецификой проекта</label>
                    </div>
                    <div className='flex justify-start'>
                        <input name='reason' onChange={(event) => setSelectedReason(event.target.value)} id='reason2' type="radio" value='work'/>
                        <label className='pl-[4px]' htmlFor='reason2'>Не сработались</label>
                    </div>
                    <div className='flex justify-start'>
                        <input name='reason' onChange={(event) => setSelectedReason(event.target.value)} id='reason3' type="radio" value='transfer'/>
                        <label className='pl-[4px]' htmlFor='reason3'>Передача проекта другому менеджеру</label>
                    </div>
                    <div className='my-4'>
                        <Select
                            options={availableManagers}
                            required={availableManagers?.length !== 0}
                            isDisabled={availableManagers?.length === 0}
                            value={getValueManager()}
                            onChange={onChangeManager}
                        />
                    </div>
                    <div className='flex justify-between space-x-2'>
                        <MyButton className='min-w-[120px]' onClick={() => setIsOpen(false)}>Назад</MyButton>
                        <MyButton className='min-w-[120px]' onClick={submit}>Применить</MyButton>
                    </div>
                </div>
            </Dialog>
            <div onClick={() => handleClick()} {...props}>Открепить от себя</div>
        </>

    );
};

export default Unpin;