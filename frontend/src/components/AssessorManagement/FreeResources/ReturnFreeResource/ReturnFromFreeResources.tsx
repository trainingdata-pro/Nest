import React, {useState} from 'react';
import MyButton from '../../../UI/MyButton';
import {useReturnFromFreeResources} from "./queries";
import {Props} from "../../Management";
import Dialog from "../../../UI/Dialog";

const ReturnFromFreeResources = ({assessorId, setIsOpenDropDown, ...props}: Props) => {
    const [isOpen, setIsOpen] = useState(false)
    const handleClick = () => {
        if (setIsOpenDropDown) {
            setIsOpenDropDown(false)
        }
        setIsOpen(true)
    }
    const {mutate} = useReturnFromFreeResources({assessorId, show: setIsOpen})
    
    return (
        <>
            <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className='px-4'>
                    <div className='border-b border-black w-full'>
                        <h1 className='px-4 py-2'>Вернуть из свободных ресурсов</h1>
                    </div>
                    <div className="my-2">
                        <p>Вы уверены, что хотите вернуть ассессора из свободных ресурсов?</p>
                    </div>
                    <div className='flex justify-between space-x-2'>
                        <MyButton className='min-w-[120px]' onClick={() => setIsOpen(false)}>Назад</MyButton>
                        <MyButton className='min-w-[120px]' onClick={() => mutate()}>Применить</MyButton>
                    </div>
                </div>
            </Dialog>
            <div onClick={() => handleClick()} className='cursor-pointer' {...props}>
                Вернуть из свободных ресурсов
            </div>
        </>
    );
};

export default ReturnFromFreeResources;