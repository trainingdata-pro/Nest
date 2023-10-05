import React, {useState} from 'react';
import Datepicker from "react-tailwindcss-datepicker"
import AssessorService from "../../services/AssessorService";
import {useMutation} from "react-query";
const Vacation = ({assessorId, close}: {
    assessorId: string | number | undefined
    close: any
}) => {
    const [value, setValue] = useState({
        startDate: null,
        endDate: null
    });
    const mutations = useMutation([], () => AssessorService.patchVacation(assessorId, {vacation: true, vacation_date: value.endDate}))
    const handleValueChange = (newValue:any) => {
        setValue(newValue);
    }
    return (
        <div className='px-4'>
            <div className='border-b border-black w-full'>
                <h1 className='px-4'>Предполагаемая дата возвращения</h1>
            </div>
            <Datepicker
                containerClassName=''
                i18n={'ru'}
                useRange={false}
                asSingle={true}
                value={value}
                onChange={handleValueChange}
            />
            {mutations.isError && <p>У исполнителя есть активные проекты</p>}
            <div className='flex space-x-2'>
                <button className="bg-[#5970F6] text-white w-full rounded-md mt-2 py-2" onClick={() => close(true)}>Назад</button>
                <button className="bg-[#5970F6] text-white w-full rounded-md mt-2 py-2" onClick={() => mutations.mutate()}>Применить</button>
            </div>
        </div>
    );
};

export default Vacation;