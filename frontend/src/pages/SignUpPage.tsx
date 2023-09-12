import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react'
import cat from "../components/SignIn/cat7.png";
import {EnvelopeIcon, LockClosedIcon} from "@heroicons/react/24/solid";
import Error from "../components/UI/Error";
import {NavLink} from "react-router-dom";
import {useForm} from "react-hook-form";
import AuthService from "../services/AuthService";
import ConfirmPage from "../components/SignUp/ConfirmPage";

export interface ISignUp {
    last_name: string,
    first_name: string,
    middle_name: string
    email: string,
    username: string,
    password: string,
    status: string,
    password2: string

}

const SignInPage = () => {
    const {register, setValue, handleSubmit, watch, formState: {errors}} = useForm<ISignUp>()
    useEffect(() => {
        setValue('status', 'manager')
    }, []);
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState({})
    const [confirmPage, setConfirmPage] = useState(false)
    const onSubmit = async (data: ISignUp) => {
        setIsLoading(true)
        try {
            await AuthService.register(data).then(res => console.log(res.data))
            setConfirmPage(true)
        } catch (e: any) {
            const errJson = JSON.parse(e.request.response)
            setServerError(errJson)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="container">
            {confirmPage && <ConfirmPage close={setConfirmPage}/>}
            <div className="flex h-screen">
                <div className="w-[50%] rounded-[16px] h-[95%] bg-white my-auto">
                    <form className="flex h-[100%] justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-[85%]">
                            <h1 className="text-[32px] font-bold mb-10">Регистрация</h1>
                            <section className="flex justify-between">
                                <div>
                                    <div className='items-center'>
                                        <input {...register('last_name', {
                                            pattern: {
                                                value: /^[А-ЯЁа-яёA-Za-z]+$/,
                                                message: "Поле должно содержать символы: A-z,А-я"
                                            },
                                        })} type="text" className="py-[19px] pl-[5px] bg-[#F4F8F7] rounded-[8px] "
                                               placeholder="Фамилия"/>

                                    </div>
                                    <Error>{errors.last_name && errors.last_name?.message}</Error>
                                </div>
                                <div>
                                    <div className='items-center'>
                                        <input {...register('first_name', {
                                            pattern: {
                                                value: /^[А-ЯЁа-яёA-Za-z]+$/,
                                                message: "Поле должно содержать символы: A-z,А-я"
                                            },
                                        })} type="text" className="py-[19px] pl-[5px] bg-[#F4F8F7] rounded-[8px] "
                                               placeholder="Имя"/>

                                    </div>
                                    <Error>{errors.first_name && errors.first_name?.message}</Error>
                                </div>
                                <div>
                                    <div className='items-center'>
                                        <input {...register('middle_name', {
                                            pattern: {
                                                value: /^[А-ЯЁа-яёA-Za-z]+$/,
                                                message: "Поле должно содержать символы: A-z,А-я"
                                            },
                                        })} type="text" className="py-[19px] pl-[5px] bg-[#F4F8F7] rounded-[8px] "
                                               placeholder="Отчество"/>

                                    </div>
                                    <Error>{errors.middle_name && errors.middle_name?.message}</Error>
                                </div>
                            </section>
                            <React.Fragment>
                                <div className='flex relative items-center'>
                                    <EnvelopeIcon className="absolute ml-[10px] h-6 w-6 text-gray-500"/>
                                    <input {...register('email', {
                                        pattern: {
                                            value: /^[a-zA-Z0-9._-]+@trainingdata.pro$/,
                                            message: "Укажите корпоративную почту"
                                        },
                                    })} autoComplete="new-email" type="text" className="h-[60px] pl-[40px] w-full bg-[#F4F8F7] rounded-[8px] "
                                           placeholder="Username"/>

                                </div>
                                <Error>{errors.email && errors.email?.message}</Error>
                            </React.Fragment>
                            <React.Fragment>
                                <div className='flex relative items-center'>
                                    <svg className="absolute ml-[10px] h-6 w-6 text-gray-500"
                                         xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"
                                         fill="none">
                                        <path
                                            d="M25 3.78509L21.3619 24.2393C21.3619 24.2393 20.8527 25.6574 19.4544 24.9773L11.0603 17.7997L11.0213 17.7785C12.1552 16.6431 20.9477 7.82695 21.3319 7.42733C21.9268 6.80842 21.5574 6.43995 20.8667 6.90749L7.87926 16.1055L2.86872 14.2254C2.86872 14.2254 2.08021 13.9126 2.00435 13.2324C1.92749 12.5512 2.89467 12.1827 2.89467 12.1827L23.3212 3.24632C23.3212 3.24632 25 2.4237 25 3.78509Z"
                                            fill="#7D7D7D"/>
                                    </svg>
                                    <input {...register('username', {
                                        pattern: {
                                            value: /^[A-Za-z\d_]{5,32}$/,
                                            message: "Никнейм должен содержать символы: A-z, _ Длина: 5-32 символа"
                                        }
                                    })} type="text"
                                           className="h-[60px] pl-[40px] w-full bg-[#F4F8F7] rounded-[8px] "
                                           placeholder="Ник в ТГ"/>
                                </div>
                                <Error>{errors.username && errors.username?.message}</Error>
                            </React.Fragment>
                            <React.Fragment>
                                <div className='flex relative items-center'>
                                    <LockClosedIcon className="absolute ml-[10px] h-6 w-6 text-gray-500"/>
                                    <input {...register('password', {
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                                            message: "Пароль не соответсвует требованиям"
                                        }
                                    })} type="password"
                                           className="h-[60px] pl-[40px] w-full bg-[#F4F8F7] rounded-[8px] "
                                           placeholder="Пароль"/>
                                </div>
                                <Error>{errors.password && errors.password?.message}</Error>
                            </React.Fragment>
                            <React.Fragment>
                                <div className='flex relative items-center'>
                                    <LockClosedIcon className="absolute ml-[10px] h-6 w-6 text-gray-500"/>
                                    <input {...register('password2')} type="password"
                                           className="h-[60px] pl-[40px] w-full bg-[#F4F8F7] rounded-[8px] "
                                           placeholder="Повторите пароль"/>
                                </div>
                                <Error>{watch('password') !== watch('password2') ? 'Пароли не совпадают' : ''}</Error>
                            </React.Fragment>
                            <button disabled={isLoading}
                                    className="flex justify-center bg-[#5970F6] py-3 text-white w-full items-center rounded-[8px]"
                                    type="submit">{!isLoading ? "Регистрация" :
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"/>}
                            </button>
                            <div className="w-full flex justify-center mt-8">Уже зарегистрированы?<NavLink
                                className="cursor-pointer pl-1 text-black font-bold" to="/login">Авторизация</NavLink>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="relative w-[50%]">
                    <img src={cat} className="absolute bottom-[52px] left-[20px] w-[631px]-max h-[663px]-max"
                         alt="cat"/>
                </div>
            </div>
        </div>
    )
}

export default observer(SignInPage);