import { observer } from 'mobx-react-lite';
import React, {useContext, useState} from 'react'
import SignInForm from "../components/SignIn/SignInForm";
import {useForm} from "react-hook-form";
import {Context} from "../index";
import {NavLink} from "react-router-dom";
import AuthService from "../services/AuthService";
import jwtDecode from "jwt-decode";
import Cookies from 'universal-cookie';
import {Token} from "../store/store";
import ManagerService from "../services/ManagerService";
interface ISignIn {
    username: string,
    password: string
}
const SignInPage = () => {
    const cookies = new Cookies()
    const {register,formState:{errors},  getValues, handleSubmit} = useForm<ISignIn>()
    const [serverError, setServerError] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const {store} = useContext(Context)
    const onSubmit = async () => {
        const values = getValues()
        setIsLoading(true)
        await AuthService.login(values.username, values.password)
            .then(res => {
                localStorage.setItem('token', res.data.access)
                const decodeJwt: Token = jwtDecode(res.data.access)
                cookies.set('refresh', `${res.data.refresh}`, { path: '/' });
                store.setAuth(true)
                const managerId = decodeJwt.user_data.manager_id
                ManagerService.fetch_manager(managerId).then(res => {
                    store.setManagerData(res.data)
                    const manager = res.data
                    if (manager.first_name === '' || manager.last_name === '' || manager.middle_name === '' || !manager.is_operational_manager && manager.operational_manager === null){
                        store.setShowProfile(true)
                    }
                })
                setIsLoading(false)
            })
            .catch(e => {
                const errJson = JSON.parse(e.request.response)
                setServerError(errJson['detail'])
                setIsLoading(false)
            })


    }
    // @ts-ignore
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="space-y-4 rounded-lg border border-gray-100 bg-white">
                <div className="px-4 pt-4 text-lg font-medium">Вход</div>
                <div className="shrink-0 bg-border bg-gray-100 h-[1px] w-full"></div>
                <div className="p-4 pt-0">
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
                </div>
            </div>
        </div>
    )
}

export default observer(SignInPage);