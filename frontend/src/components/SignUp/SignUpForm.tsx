import React, {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import AuthService from "../../services/AuthService";
import {NavLink} from "react-router-dom";
import ConfirmPage from "./ConfirmPage";

interface ISignUp {
    email: string,
    username: string,
    password: string,
    password2: string

}

const SignUpForm = () => {
    const {register, handleSubmit,watch, formState: {errors}} = useForm<ISignUp>()
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState({})
    const [confirmPage, setConfirmPage] = useState(false)

    const Submit = async (data: ISignUp) => {
        setIsLoading(true)
        try{
            await AuthService.register(data.username, data.email, data.password).then(res => console.log(res.data))
            setConfirmPage(true)
        } catch (e:any) {
            const errJson = JSON.parse(e.request.response)
            setServerError(errJson)
        } finally {
            setIsLoading(false)
        }
    }

    return (

            <div>
                {confirmPage && <ConfirmPage close={setConfirmPage}/>}
                <form className="w-[30rem]" onSubmit={handleSubmit(Submit)}>
                    <div className="">
                        <label
                            className="text-sm font-medium leading-none"
                            htmlFor="email">Почта</label>
                        <input
                            type="text"
                            className="flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground w-full"
                            {...register("email", {
                                required: "Обязательное поле",
                                pattern: {
                                    value: /trainingdata\.pro$/,
                                    message: "Требуется указать корпоративную почту"
                                }
                            })}
                            autoComplete="new-email"
                            placeholder="Ваша корпоративная почта"
                            aria-invalid={errors.email ? "true" : "false"}
                        ></input>
                        <p className='h-6 text-red-500 text-sm'>{errors.email && errors.email?.message}</p>

                    </div>

                    <div>
                        <label
                            className="text-sm font-medium leading-none"
                            htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground w-full"
                            {...register("username", {required: "Обязательное поле"})}
                            autoComplete="new-username"
                            placeholder="Ваш ник в телеграм"
                        ></input>
                        <p className='h-6 text-red-500 text-sm'>{errors.username && errors.username?.message}</p>
                    </div>
                    <div>
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="password">Пароль</label>
                        <input
                            className="flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground w-full"
                            type="password"
                            autoComplete="new-password"
                            {...register("password",{required: "Обязательное поле"} )}
                        ></input>
                        <p className='h-6 text-red-500 text-sm'>{errors.password && errors.password?.message}</p>
                    </div>
                    <div>
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="password2">Подтверждение пароля</label>
                        <input
                            className="flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground w-full"
                            type="password"
                            autoComplete="new-password2"
                            {...register("password2",{required: "Обязательное поле"})}
                        ></input>
                        <p className='h-6 text-red-500 text-sm'>{watch('password') !== watch('password2') ? 'Пароли не совпадают': ''}</p>
                    </div>
                   {
                       // @ts-ignore
                       Object.keys(serverError).map(error => <p className='h-6 text-red-500 text-sm'>{serverError[error][0]}</p>)
                   }
                    <section className="flex items-center justify-between mb-3">
                        <div className="space-y-2">
                            <div className="text-sm text-gray-500">Уже зарегистрированы?<NavLink
                                className="cursor-pointer pl-1 text-black text-primary hover:underline" to="/login">Авторизация</NavLink>
                            </div>
                        </div>
                        <div>
                            <button disabled={isLoading}
                                    className="bg-black text-white rounded-md text-sm font-medium disabled:opacity-50 transition-colors hover:bg-primary/90 h-10 py-2 px-4"
                                    type="submit">{!isLoading ? "Регистрация" : <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"/>}
                            </button>                        </div>
                    </section>
                </form>
            </div>

    );
};

export default SignUpForm;