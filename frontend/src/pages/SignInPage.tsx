import React, {useContext, useState} from 'react'
import cat from '../components/SignIn/cat7.png'
import {useForm} from "react-hook-form";
import {Context} from "../index";
import {NavLink} from "react-router-dom";
import { EnvelopeIcon } from "@heroicons/react/24/solid";



interface ISignIn {
    username: string,
    password: string
}
const SignInPage = () => {
    const {register, formState: {errors}, getValues, handleSubmit} = useForm<ISignIn>()
    const [serverError, setServerError] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const {store} = useContext(Context)
    const onSubmit = async () => {
        setIsLoading(true)
        const values = getValues()
        await store.login(values.username, values.password)
        setIsLoading(false)
    }
    return(
        <div className="container">
            <div className="flex h-screen">
                <div className="relative w-[50rem]">
                    <img src={cat} className="absolute bottom-[52px] left-[52px] w-[631px]-max h-[663px]-max" alt="cat"/>
                </div>
                <div className="w-[50rem] rounded-[16px] bg-white my-[18px]">
                    <form className="px-[103px] pt-[118px]" onSubmit={handleSubmit(onSubmit)}>
                        <h1 className="text-[32px] font-bold pb-[60px]">Добро пожаловать</h1>
                        <div className='flex relative items-center'>
                            <EnvelopeIcon className="absolute h-6 w-6 text-gray-500" />
                            <input {...register('username')} type="text" className="h-[60px] pl-[30px] w-full bg-[#F4F8F7] rounded-[8px] " placeholder="Username"/>
                        </div>
                        <input {...register('password')} type="password" className="h-[60px] w-full bg-[#F4F8F7] rounded-[8px] pl-2 mb-6" placeholder="Пароль"/>
                        <div className="w-full flex justify-end mb-[48px]">
                            <p className="text-black cursor-pointer underline">Забыли пароль?</p>
                        </div>
                        <button disabled={isLoading}
                                className="flex bg-[#5970F6] justify-center py-[19px] text-white w-full items-center rounded-[8px] mb-[140px]"                                type="submit">{!isLoading ? "Войти" :
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"/>}
                        </button>
                        <div className="w-full flex justify-center">Еще нет аккаунта?<NavLink
                            className="cursor-pointer pl-1 text-black font-bold" to="/register">Зарегистрироваться</NavLink>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignInPage;
