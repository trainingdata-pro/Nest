import React from 'react';
import {useMutation, useQueryClient} from "react-query";
import AssessorService from "../../services/AssessorService";


const VacationReturn = ({assessorId,setIsReturnVacation}: {
    assessorId: string | number | undefined,
    setIsReturnVacation:any
}) => {
    const queryClient = useQueryClient()

    const vacationReturn = useMutation(['currentAssessor', assessorId], ({id, data}:any) => AssessorService.patchVacation(id, data), {
        onSuccess: () => {
            queryClient.invalidateQueries('assessorHistory')
            queryClient.invalidateQueries(['currentAssessor', assessorId])
            setIsReturnVacation(true)
        }
    })

    return (
        <div className='w-[25rem]'>
            <div className='w-full'>
                <h1 className='px-4 border-b border-black mb-2'>Вернуть из отпуска</h1>
                <p>Выдействительно хотите вернуть ассессора из отпуска?</p>
                <div className='flex space-x-2'>


                    <button className='bg-[#5970F6] text-white w-full rounded-md mt-2 py-2'
                            onClick={() => setIsReturnVacation(false)}>Назад
                    </button>
                    <button className='bg-[#5970F6] text-white w-full rounded-md mt-2 py-2'
                            onClick={() => vacationReturn.mutate({id: assessorId, data: {vacation:false}})}>Подтвердить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VacationReturn;