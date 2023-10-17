import React, {useState} from 'react';
import {EnvelopeIcon} from "@heroicons/react/24/solid";
import Error from "./UI/Error";
import {useForm} from "react-hook-form";
import AuthService from "../services/AuthService";
import {errorNotification, successNotification} from "./UI/Notify";

const EmailToReset = ({setIsOpen}:{
    setIsOpen: React.Dispatch<boolean>
}) => {
    const {register, getValues, handleSubmit, formState: {errors}} = useForm<{email:string}>()
    const [isLoading, setIsLoading] = useState(false)
    const onSubmit = async () => {
        setIsLoading(true)
            AuthService.sendResetEmail(getValues('email')).then(() => {
                successNotification('Ссылка отправлена не почту')
                setIsOpen(false)
            }).catch(()=> {
                errorNotification('Произошла ошибка. Обратитесь к администратору')
            })

        setIsLoading(false)
    }
    return (
        <div>
            <h1>Укажите почту для восстановления пароля</h1>
            <form className="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="my-2 space-y-2">
                        <div className='flex relative items-center'>
                            <EnvelopeIcon className="absolute ml-[10px] h-6 w-6 text-gray-500"/>
                            <input {...register('email', {
                                pattern: {
                                    value: /^[a-zA-Z0-9._-]+@trainingdata.pro$/,
                                    message: "Укажите корпоративную почту"
                                },
                                required: {
                                    value: true,
                                    message: 'Обязательное поле'
                                }
                            })} type="email" name="email"
                                   className="py-[12px] pl-[40px] w-full bg-[#F4F8F7] rounded-[8px] "
                                   placeholder="Почта"/>
                        </div>
                        <Error>{errors.email && errors.email?.message}</Error>
                    </div>
                <button disabled={isLoading}
                        className="flex justify-center bg-[#5970F6] py-3 text-white w-full items-center rounded-[8px]"
                        type="submit">{!isLoading ? "Отправить" :
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"/>}
                </button>
            </form>
        </div>
    );
};

export default EmailToReset;