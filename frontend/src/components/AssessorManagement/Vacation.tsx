import React, {useState} from 'react';
import Datepicker from "react-tailwindcss-datepicker"
import AssessorService from "../../services/AssessorService";
import {useMutation, useQueryClient} from "react-query";
import {errorNotification, successNotification} from "../UI/Notify";
const Vacation = ({assessorId, close}: {
    assessorId: string | number | undefined
    close: any
}) => {
    const [value, setValue] = useState({
        startDate: null,
        endDate: null
    });
    const queryClient = useQueryClient()

    const mutations = useMutation(['currentAssessor', assessorId], () => AssessorService.patchVacation(assessorId, {vacation: true, vacation_date: value.endDate}), {
        onSuccess: () => {
            queryClient.invalidateQueries('assessorHistory')
            queryClient.invalidateQueries(['currentAssessor', assessorId])
            successNotification('Ассессор отправлен в отпуск')
            close(false)
        },
        onError: (error:any) => {
            const jsonError = JSON.parse(error.request.responseText)
            console.log(jsonError[Object.keys(jsonError)[0]])
            errorNotification(jsonError[Object.keys(jsonError)[0]][0])

        }
    })
    const handleValueChange = (newValue:any) => {
        setValue(newValue);
    }
    const submit = () => {
        if (value.endDate){
            mutations.mutate()
        } else {
            errorNotification('Выберите дату')
        }
    }
    return (
        <div className='px-4'>
            <div className='border-b border-black w-full '>
                <h1 className='px-4'>Предполагаемая дата возвращения</h1>
            </div>
            <div className="my-4">
            <Datepicker
                i18n={'ru'}
                useRange={false}
                asSingle={true}
                readOnly={true}
                value={value}
                onChange={handleValueChange}
            />
                </div>
            <div className='flex space-x-2'>
                <button className="bg-[#5970F6] text-white w-full rounded-md mt-2 py-2" onClick={() => close(false)}>Назад</button>
                <button className="bg-[#5970F6] text-white w-full rounded-md mt-2 py-2" onClick={submit}>Применить</button>
            </div>
        </div>
    );
};

export default Vacation;