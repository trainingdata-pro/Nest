import React from 'react';
import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../../../services/AssessorService";
import {errorNotification, successNotification} from "../../../UI/Notify";
import {useVacationReturn} from "./queries";
import MyButton from "../../../UI/MyButton";


const VacationReturn = ({assessorId, setIsReturnVacation}: {
    assessorId: string | number | undefined,
    setIsReturnVacation: any
}) => {
    const {mutate} = useVacationReturn({assessorId, setIsReturnVacation})

    return (
        <div className='w-[25rem]'>
            <div className='w-full'>
                <h1 className='px-4 border-b border-black mb-2'>Вернуть из отпуска</h1>
                <p className='pb-[10px]'>Выдействительно хотите вернуть ассессора из отпуска?</p>
                <div className='flex justify-between space-x-2'>
                    <MyButton className='min-w-[120px]' onClick={() => setIsReturnVacation(false)}>Назад</MyButton>
                    <MyButton className='min-w-[120px]' onClick={() => mutate({id: assessorId, data: {vacation: false}})}>Подтвердить</MyButton>
                </div>
            </div>
        </div>
    );
};

export default VacationReturn;