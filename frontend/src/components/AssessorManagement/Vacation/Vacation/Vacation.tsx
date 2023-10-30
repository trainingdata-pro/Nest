import React, {useState} from 'react';
import Datepicker from "react-tailwindcss-datepicker"
import {errorNotification} from "../../../UI/Notify";
import MyButton from "../../../UI/MyButton";
import {useSetVacation} from "./queries";

const Vacation = ({assessorId, close}: {
    assessorId: string | number | undefined
    close: any
}) => {
    const [value, setValue] = useState({
        startDate: null,
        endDate: null
    });
    const {mutate} = useSetVacation({assessorId, close})
    const handleValueChange = (newValue: any) => {
        setValue(newValue);
    }
    const submit = () => {
        if (value.endDate) {
            mutate(value.endDate)
        } else {
            errorNotification('Выберите дату')
        }
    }
    return (
        <div className='px-4'>
            <div className='border-b border-black w-full '>
                <h1 className='px-4'>Отправить в отпуск</h1>
            </div>
            <div className="my-4">
                <p className='w-[300px] pb-[10px]'>
                    Выберите предполагаемую дату возвращения из отпуска
                </p>
                <Datepicker
                    i18n={'ru'}
                    useRange={false}
                    asSingle={true}
                    readOnly={true}
                    value={value}
                    onChange={handleValueChange}
                />
            </div>
            <div className='flex justify-between space-x-2'>
                <MyButton className='min-w-[120px]' onClick={() => close(false)}>Назад</MyButton>
                <MyButton className='min-w-[120px]' onClick={submit}>Применить</MyButton>
            </div>
        </div>
    );
};

export default Vacation;