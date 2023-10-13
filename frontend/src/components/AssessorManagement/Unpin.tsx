import React, {useState} from 'react';
import MyButton from "../UI/MyButton";
import {errorNotification, successNotification} from "../UI/Notify";
import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../services/AssessorService";
import {useNavigate} from "react-router-dom";
import Select from "react-select";

// @ts-ignore
const Unpin = ({assessorId,assessor, close}) => {
    console.log(assessor)
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [selectedReason, setSelectedReason] = useState<string>()
    const unpinAssessor = useMutation(['assessors'], ({assessorId,data}: any) => AssessorService.unpinAssessor(assessorId, data),{
        onSuccess: () => {
            queryClient.invalidateQueries(['assessors'])
            successNotification('Ассессор успешно откреплен')
            navigate(-1)
        },
        onError: () => {
            errorNotification('У исполнителя есть активные проекты текущего менеджера.')
        }
     })
    const [selectedManager, setSelectedManager] = useState<number>()
    const [availableManagers, setAvailableManagers] = useState(assessor?.second_manager.map((manager:any) => {
        return {label: `${manager.last_name} ${manager.first_name}`, value: manager.id}}))
    const submit = ()=> {
        if (selectedReason){
            if (selectedReason !== 'transfer'){
                unpinAssessor.mutate({assessorId: assessorId, data: {reason: selectedReason}})

            } else {
                unpinAssessor.mutate({assessorId:assessorId,data: {reason: selectedReason, manager: selectedManager}})
            }

            close(false)
        } else {
            errorNotification('Выберите причину')
        }

    }
    const onChangeManager = (newValue: any) => {
        setSelectedManager(newValue.value)
    }
    const getValueManager = () => {
        return selectedManager ? availableManagers.find((c:any) => c.value === selectedManager) : ''
    }
    return (
        <div>
            <div className='border-b border-black w-full'>
                <h1 className='px-4'>Убрать с проекта</h1>
            </div>
            <div className='flex justify-start'>
                <input name='reason' onChange={(event) => setSelectedReason(event.target.value)} id='reason1' type="radio" value='project'/>
                <label htmlFor='reason1'>Не смог работать со спецификой проекта</label>
            </div>
            <div className='flex justify-start'>
                <input name='reason' onChange={(event) => setSelectedReason(event.target.value)} id='reason2' type="radio" value='work'/>
                <label htmlFor='reason2'>Не сработались</label>
            </div>
            <div className='flex justify-start'>
                <input name='reason' onChange={(event) => setSelectedReason(event.target.value)} id='reason3' type="radio" value='transfer'/>
                <label htmlFor='reason3'>Передача проекта другому менеджеру</label>
            </div>
            {selectedReason === 'transfer' && <Select
                options={availableManagers}
                value={getValueManager()}
                onChange={onChangeManager}
                />}
            <div className='flex space-x-2'>
                <MyButton onClick={() => close(true)}>Назад</MyButton>
                <MyButton onClick={submit}>Применить</MyButton>
            </div>
        </div>
    );
};

export default Unpin;