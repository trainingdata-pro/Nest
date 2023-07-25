
import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import {NavLink, redirect, useLocation, useNavigate} from "react-router-dom";
import {useContext} from "react";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
interface ISignIn {
    username: string,
    password: string
}
const SignInForm = () => {
    const navigate = useNavigate();
    const {register,formState:{errors},  getValues, handleSubmit} = useForm<ISignIn>()
    const [serverError, setServerError] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const {store} = useContext(Context)
    useEffect(()=> {

    }, [serverError, isLoading])
    const onSubmit = async () => {
        setIsLoading(true)
        const values = getValues()
            await store.login(values.username, values.password).
            then(() => {
                navigate('/dashboard/main')
            }).catch(err => setServerError(err.response.data.detail)).finally(() => setIsLoading(false))
    }
    return (
        <form className="w-[30rem]"
              onSubmit={handleSubmit(onSubmit)}>
            <div className="my-4">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="username">
                    Имя пользователя
                </label>
                <input
                    className="flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                    placeholder="username"
                    {...register("username", {required: "Обязательное поле"})}
                />
                <p className='h-6 text-red-500 text-sm pt-1'>{errors.username && errors.username?.message}</p>
            </div>
            <div className="my-4">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                    Пароль
                </label>
                <input
                    className="flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                    type="password"
                    placeholder="Введите ваш пароль"
                    {...register("password", {required: "Обязательное поле"})}
                />
                <p className='h-6 text-red-500 text-sm pt-1'>{errors.password && errors.password?.message}</p>
            </div>
            <p className="text-sm text-red-500 h-5">{serverError}</p>
            <section className="flex justify-between items-center">
                <div className="w-100">
                    <div className="text-sm text-gray-500">Не зарегистрированы?<NavLink
                        className="cursor-pointer pl-1 text-black text-primary hover:underline" to="/register">Создайте аккаунт</NavLink>
                    </div>
                </div>
                <div className="">
                    <button disabled={isLoading}
                            className="bg-black text-white rounded-md text-sm font-medium disabled:opacity-50 transition-colors hover:bg-primary/90 h-10 py-2 px-4"
                            type="submit">{!isLoading ? "Войти" : <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"/>}
                    </button>
                </div>

            </section>
        </form>
    );
};

export default observer(SignInForm);