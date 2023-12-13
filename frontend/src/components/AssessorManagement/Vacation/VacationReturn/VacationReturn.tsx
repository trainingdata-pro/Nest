import {useState} from 'react';
import {useVacationReturn} from "./queries";
import MyButton from "../../../UI/MyButton";
import Dialog from "../../../UI/Dialog";
import {Props} from "../../Management";


const VacationReturn = ({assessorId, setIsOpenDropDown, ...props}: Props) => {
    const [isOpen, setIsOpen] = useState(false)

    const {mutate} = useVacationReturn({setIsReturnVacation: setIsOpen})
    const handleClick = () => {
        setIsOpenDropDown(false)
        setIsOpen(true)
    }
    return (
        <>
            <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className='w-[25rem]'>
            <div className='w-full'>
                <h1 className='px-4 border-b border-black mb-2'>Вернуть из отпуска</h1>
                <p className='pb-[10px]'>Выдействительно хотите вернуть ассессора из отпуска?</p>
                <div className='flex justify-between space-x-2'>
                    <MyButton className='min-w-[120px]' onClick={() => setIsOpen(false)}>Назад</MyButton>
                    <MyButton className='min-w-[120px]' onClick={() => mutate({id: assessorId, data: {vacation: false}})}>Подтвердить</MyButton>
                </div>
            </div>
        </div>
        </Dialog>
            <div onClick={() => handleClick()} className='cursor-pointer' {...props}>
                Вернуть из отпуска
            </div>
        </>
    );
};

export default VacationReturn;