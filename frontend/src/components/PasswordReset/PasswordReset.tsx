import React, {useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {LockClosedIcon} from "@heroicons/react/24/solid";
import Error from "../UI/Error";
import {ISignUp} from "../../pages/SignUpPage";
import AuthService from "../../services/AuthService";
import {log} from "util";
import {errorNotification, successNotification} from "../UI/Notify";


interface Reset {
    password: string,
    password2: string
}

const PasswordReset = () => {
    const {id} = useParams()
    const {register, setValue, getValues, handleSubmit, watch, formState: {errors}} = useForm<Reset>()
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const onSubmit = async () => {
        setIsLoading(true)
        if (id){
            AuthService.resetPassword(id, getValues('password')).then(() => {
                successNotification('Пароль успешно сброшен')
                navigate('/login')
            }).catch(()=> {
                errorNotification('Произошла ошибка. Обратитесь к администратору')
            })
        } else {
            errorNotification('Произошла ошибка. Обратитесь к администратору')
        }

        setIsLoading(false)
    }
    return (
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen'>
            <div className="block w-[50%] rounded-[16px] h-fit bg-white py-4 px-4">
                <h1 className="text-[20px] w-full text-center font-bold">Восстановление пароля</h1>
                <form className="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="">
                        <div className="my-2 space-y-2">
                            <div className='flex relative items-center'>
                                <LockClosedIcon className="absolute ml-[10px] h-6 w-6 text-gray-500"/>
                                <input {...register('password', {
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                                        message: "Пароль должен содержать минимум 8 символов, Буквы A-z, и один из спецсиволов !@#$%^&*"
                                    }, required: {
                                        value: true,
                                        message: 'Обязательное поле'
                                    }
                                })} type="password" name="password"
                                       className="py-[12px] pl-[40px] w-full bg-[#F4F8F7] rounded-[8px] "
                                       placeholder="Пароль"/>
                            </div>
                            <Error>{errors.password && errors.password?.message}</Error>
                        </div>
                        <div className="my-2 space-y-2">
                            <div className='flex relative items-center'>
                                <LockClosedIcon className="absolute ml-[10px] h-6 w-6 text-gray-500"/>
                                <input {...register('password2')} type="password"
                                       name="password2"
                                       className="py-[12px] pl-[40px] w-full bg-[#F4F8F7] rounded-[8px] "
                                       placeholder="Повторите пароль"/>
                            </div>
                            <Error>{watch('password') !== watch('password2') ? 'Пароли не совпадают' : ''}</Error>
                        </div>
                        <button disabled={isLoading}
                                className="flex justify-center bg-[#5970F6] py-3 text-white w-full items-center rounded-[8px]"
                                type="submit">{!isLoading ? "Подтвредить" :
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"/>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordReset;