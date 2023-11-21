import React from 'react';
import MyButton from '../../../UI/MyButton';
import {useReturnFromFreeResources} from "./queries";

const ReturnFromFreeResources = ({assessorId, show}:{assessorId:string|number, show:any}) => {
    const {mutate} = useReturnFromFreeResources({assessorId, show})
    
    return (
        <div className='px-4'>
            <div className='border-b border-black w-full'>
                <h1 className='px-4 py-2'>Вернуть из свободных ресурсов</h1>
            </div>
            <div className="my-2">
                <p>Вы уверены, что хотите вернуть ассессора из свободных ресурсов?</p>
            </div>
            <div className='flex justify-between space-x-2'>
                <MyButton className='min-w-[120px]' onClick={() => show(false)}>Назад</MyButton>
                <MyButton className='min-w-[120px]' onClick={() => mutate()}>Применить</MyButton>
            </div>
        </div>
    );
};

export default ReturnFromFreeResources;