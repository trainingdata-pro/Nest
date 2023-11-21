import React from 'react';
import MyButton from "./MyButton";

const Confirm = ({isCloseConfirm, isCloseModal}:{
    isCloseConfirm: React.Dispatch<boolean>,
    isCloseModal: React.Dispatch<boolean>
}) => {
    return (
        <div className='max-w-[400px]'>
            <p>Вы уверены, что хотите закрыть окно? Все введеные данные будут утеряны.</p>
            <div className="flex justify-between pt-3 space-x-2">
            <MyButton onClick={() => isCloseConfirm(false)}>Отмена</MyButton>
            <MyButton onClick={() => {
                isCloseConfirm(false)
                isCloseModal(false)
            }}>Подтвердить</MyButton>
            </div>
        </div>
    );
};

export default Confirm;