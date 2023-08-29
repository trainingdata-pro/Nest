import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Context} from "../../index";
import AuthService from "../../services/AuthService";

const ConfirmationSignUp = () => {
    const variants = {
        'complete': "Аккаунт успешно активирован. Через 3 секунды вы будете перенаправлены на страницу авторизации.",
        'error': "Произогла ошибка при активации аккаунта. Обратитесь к администратору."
    }
    const navigate = useNavigate()
    const code = useParams()["id"]
    const [completeRegister, setCompleteRegister] = useState(false)
    const {store} = useContext(Context)
    useEffect(()=>{
            // @ts-ignore
            AuthService.confirmRegistration(code).then(res => {
                setCompleteRegister(true)
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
            }).catch((e) => {})


    }, [])
    return (
        <div>
            {completeRegister ? <div>{variants.complete}</div> : <div>{variants.error}</div>}
        </div>
    );
};

export default ConfirmationSignUp;