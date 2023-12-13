import React, {useState} from 'react';
import Datepicker, {DateValueType} from "react-tailwindcss-datepicker"
import {errorNotification} from "../../../UI/Notify";
import MyButton from "../../../UI/MyButton";
import {useSetVacation} from "./queries";
import Dialog from '../../../UI/Dialog';
import {Props} from "../../Management";


const Vacation = ({assessorId,setIsOpenDropDown, ...props}: Props) => {
    const [isOpen, setIsOpen] = useState(false)

    const [value, setValue] = useState<DateValueType>({
        startDate: null,
        endDate: null
    });
    const handleClick = () => {
        setIsOpenDropDown(false)
        setIsOpen(true)
    }
    const {mutate} = useSetVacation({assessorId, close: setIsOpen})
    const submit = () => {
        if (value?.endDate) {
            mutate(value.endDate)
        } else {
            errorNotification('Выберите дату')
        }
    }
    return (
        <>
            <Dialog isOpen={isOpen} setIsOpen={setIsOpen} topLayer={true}>
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
                    onChange={(value) => setValue(value)}
                />
            </div>
            <div className='flex justify-between space-x-2'>
                <MyButton className='min-w-[120px]' onClick={() => setIsOpen(false)}>Назад</MyButton>
                <MyButton className='min-w-[120px]' onClick={submit}>Применить</MyButton>
            </div>
        </div>
            </Dialog>
            <div onClick={() => handleClick()} {...props}>
                Отправить в отпуск
            </div>
        </>
    );
};

export default Vacation;