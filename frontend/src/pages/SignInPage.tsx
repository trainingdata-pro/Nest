import React, {useContext, useState} from 'react'
import cat from '../components/SignIn/cat7.png'
import {useForm} from "react-hook-form";
import {Context} from "../index";
import {NavLink} from "react-router-dom";
import {EnvelopeIcon, LockClosedIcon} from "@heroicons/react/24/solid";
import Error from "../components/UI/Error";
import {observer} from "mobx-react-lite";
import Dialog from "../components/UI/Dialog";
import EmailToReset from "../components/PasswordReset/EmailToReset";


interface ISignIn {
    email: string,
    password: string
}

const SignInPage = () => {
    const {register, formState: {errors}, getValues, handleSubmit} = useForm<ISignIn>()
    const [isLoading, setIsLoading] = useState(false)
    const {store} = useContext(Context)
    const [isShowEmailToReset, setIsShowEmailToReset] = useState(false)
    const onSubmit = async () => {
        setIsLoading(true)
        const values = getValues()
        await store.login(values.email, values.password)
        setIsLoading(false)
    }
    return (
        <div className="container">
            <Dialog isOpen={isShowEmailToReset} setIsOpen={setIsShowEmailToReset}>
                <EmailToReset setIsOpen={setIsShowEmailToReset}/>
            </Dialog>
            <div className="flex h-screen">
                <div className="w-[50%] my-auto">
                    <img src={cat} className="left-[20px]"
                         alt="cat"/>
                </div>
                <div className="w-[45%] rounded-[16px] h-[95%] bg-white my-auto">
                    <form className="flex h-[100%] justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-[95%]">
                            <h1 className="text-[32px] w-full text-center font-bold mb-28">Добро пожаловать</h1>
                            <div className="my-2">
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
                                    })} type="text" className="h-[60px] pl-[40px] w-full bg-[#F4F8F7] rounded-[8px] "
                                           placeholder="email"/>

                                </div>
                                <Error>{errors.email && errors.email?.message}</Error>
                            </div>
                            <div className="my-2">
                                <div className='flex relative items-center'>
                                    <LockClosedIcon className="absolute ml-[10px] h-6 w-6 text-gray-500"/>
                                    <input {...register('password')} type="password"
                                           className="h-[60px] pl-[40px] w-full bg-[#F4F8F7] rounded-[8px] "
                                           placeholder="Password"/>
                                </div>
                                <Error>{errors.password && errors.password?.message}</Error>
                            </div>
                            <Error>{store.authError}</Error>
                            <div className="w-full flex justify-end mt-3 my-6">
                                <p className="text-black cursor-pointer underline" onClick={() => setIsShowEmailToReset(true)}>Забыли пароль?</p>
                            </div>
                            <button disabled={isLoading}
                                    className="flex justify-center bg-[#5970F6] py-3 text-white w-full items-center rounded-[8px]"
                                    type="submit">{!isLoading ? "Войти" :
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"/>}
                            </button>
                            <div className="w-full flex justify-center mt-28">Еще нет аккаунта?<NavLink
                                className="cursor-pointer pl-1 text-black font-bold"
                                to="/register">Зарегистрироваться</NavLink>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default observer(SignInPage);
