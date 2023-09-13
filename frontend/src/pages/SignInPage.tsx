import React, {useContext, useState} from 'react'
import cat from '../components/SignIn/cat7.png'
import {useForm} from "react-hook-form";
import {Context} from "../index";
import {NavLink} from "react-router-dom";
import {EnvelopeIcon, LockClosedIcon} from "@heroicons/react/24/solid";
import Error from "../components/UI/Error";
import {observer} from "mobx-react-lite";


interface ISignIn {
    email: string,
    password: string
}

const SignInPage = () => {
    const {register, formState: {errors}, getValues, handleSubmit} = useForm<ISignIn>()
    const [isLoading, setIsLoading] = useState(false)
    const {store} = useContext(Context)
    const onSubmit = async () => {
        setIsLoading(true)
        const values = getValues()
        await store.login(values.email, values.password)
        setIsLoading(false)
    }
    return (
        <div className="container">
            <div className="flex h-screen">
                <div className="relative w-[50%]">
                    <img src={cat} className="absolute bottom-[52px] left-[20px] w-[631px]-max h-[663px]-max"
                         alt="cat"/>
                </div>
                <div className="w-[50%] rounded-[16px] h-[95%] bg-white my-auto">
                    <form className="flex h-[100%] justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-[85%]">
                            <h1 className="text-[32px] font-bold mb-28">Добро пожаловать</h1>
                            <React.Fragment>
                                <div className='flex relative items-center'>
                                    <EnvelopeIcon className="absolute ml-[10px] h-6 w-6 text-gray-500"/>
                                    <input {...register('email', {
                                        pattern: {
                                            value: /^[a-zA-Z0-9._-]+@trainingdata.pro$/,
                                            message: "Укажите корпоративную почту"
                                        },
                                    })} type="text" className="h-[60px] pl-[40px] w-full bg-[#F4F8F7] rounded-[8px] "
                                           placeholder="Username"/>

                                </div>
                                <Error>{errors.email && errors.email?.message}</Error>
                            </React.Fragment>
                            <React.Fragment>
                                <div className='flex relative items-center'>
                                    <LockClosedIcon className="absolute ml-[10px] h-6 w-6 text-gray-500"/>
                                    <input {...register('password')} type="password"
                                           className="h-[60px] pl-[40px] w-full bg-[#F4F8F7] rounded-[8px] "
                                           placeholder="Password"/>
                                </div>
                                <Error>{errors.password && errors.password?.message}</Error>
                            </React.Fragment>
                            <Error>{store.authError}</Error>
                            <div className="w-full flex justify-end mt-3 my-6">
                                <p className="text-black cursor-pointer underline">Забыли пароль?</p>
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
