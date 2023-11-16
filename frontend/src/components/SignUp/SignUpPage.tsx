import {observer} from 'mobx-react-lite';
import cat from "../SignIn/cat7.png";
import {EnvelopeIcon, LockClosedIcon} from "@heroicons/react/24/solid";
import Error from "../UI/Error";
import {NavLink} from "react-router-dom";
import {useForm} from "react-hook-form";
import AuthService from "../../services/AuthService";
import MyInput from "../UI/MyInput";
import {useMutation} from "react-query";
import {errorNotification, successNotification} from "../UI/Notify";
import {AxiosError} from "axios";
import MyButton from "../UI/MyButton";

const Errors = {
    last_name: 'Фамилия',
    first_name: 'Имя',
    middle_name: 'Отчество',
    username: 'Ник в ТГ',
    email: 'Почта',
    password: 'Пароль'

}

export interface ISignUp {
    last_name: string,
    first_name: string,
    middle_name: string
    email: string,
    login: string,
    password: string,
    status: string,
    password2: string

}

const SignInPage = () => {
    const {register, getValues, handleSubmit, watch, formState: {errors}} = useForm<ISignUp>({
        defaultValues: {
            status: 'manager'
        }
    })
    const signUp = useMutation([], ({data}: any) => AuthService.register(data), {
        onSuccess: () => {
            successNotification('Ссылка с подтверждением отправлена на почту')
        },
        onError: (error: AxiosError) => {
            const errors = error.response?.data ? error.response?.data : {}
            const keys = Object.keys(errors)
            // @ts-ignore
            const notify = <div>{keys.map(key => <p key={key}>{`${Errors[key]}: ${errors[key][0]}`}</p>)}</div>
            errorNotification(notify)
        },
    })
    const onSubmit = async () => {
        let {login, ...rest} = getValues()
        const username = {username: login}
        const data = {...rest, ...username}
        signUp.mutate({data: data})
    }
    return (
        <div className="container">
            <div className="flex h-screen justify-center">
                <div className="w-[45%] rounded-[16px] h-[95%] bg-white my-auto">
                    <form className="flex h-full justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
                        <div className="w-[95%]">
                            <h1 className="text-[32px] w-full text-center font-bold mb-10">Регистрация</h1>
                            <section className="flex flex-row my-2 space-x-2 box-border">
                                <div className='basis-full'>
                                    <MyInput
                                        className={'pl-[15px]'}
                                        register={{
                                            ...register('last_name', {
                                                pattern: {
                                                    value: /^[А-ЯЁа-яёA-Za-z\s-]+$/,
                                                    message: "Поле должно содержать символы: A-z,А-я"
                                                },
                                                required: {
                                                    value: true,
                                                    message: 'Обязательное поле'
                                                }

                                            })
                                        }} type="text"
                                        name="last_name"
                                        placeholder="Фамилия"/>

                                    <Error>{errors.last_name && errors.last_name?.message}</Error>
                                </div>
                                <div className='basis-full'>
                                    <MyInput
                                        className={'pl-[15px]'}
                                        register={{
                                            ...register('first_name', {
                                                pattern: {
                                                    value: /^[А-ЯЁа-яёA-Za-z\s-]+$/,
                                                    message: "Поле должно содержать символы: A-z,А-я"
                                                }, required: {
                                                    value: true,
                                                    message: 'Обязательное поле'
                                                }
                                            })
                                        }}
                                        type="text"
                                        name="first_name"
                                        placeholder="Имя"/>
                                    <Error>{errors.first_name && errors.first_name?.message}</Error>
                                </div>
                                <div className='basis-full'>

                                    <MyInput
                                        register={{
                                            ...register('middle_name', {
                                                pattern: {
                                                    value: /^[А-ЯЁа-яёA-Za-z\s-]+$/,
                                                    message: "Поле должно содержать символы: A-z,А-я"
                                                }
                                            })
                                        }}
                                        type="text"
                                        name="middle_name"
                                        placeholder="Отчество"/>
                                    <Error>{errors.middle_name && errors.middle_name?.message}</Error>
                                </div>
                            </section>
                            <div className="my-2">
                                <div className='flex relative items-center'>
                                    <EnvelopeIcon className="absolute ml-[10px] h-6 w-6 text-gray-500"/>
                                    <MyInput register={{
                                        ...register('email', {
                                            pattern: {
                                                value: /^[a-zA-Z0-9._-]+@trainingdata.pro$/,
                                                message: "Укажите корпоративную почту"
                                            }, required: {
                                                value: true,
                                                message: 'Обязательное поле'
                                            }

                                        })
                                    }} type="email" name="email"
                                             className="pl-[40px]"
                                             placeholder="Email"/>

                                </div>
                                <Error>{errors.email && errors.email?.message}</Error>
                            </div>
                            <div className="my-2">
                                <div className='flex relative items-center'>
                                    <svg className="absolute ml-[10px] h-6 w-6 text-gray-500"
                                         xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"
                                         fill="none">
                                        <path
                                            d="M25 3.78509L21.3619 24.2393C21.3619 24.2393 20.8527 25.6574 19.4544 24.9773L11.0603 17.7997L11.0213 17.7785C12.1552 16.6431 20.9477 7.82695 21.3319 7.42733C21.9268 6.80842 21.5574 6.43995 20.8667 6.90749L7.87926 16.1055L2.86872 14.2254C2.86872 14.2254 2.08021 13.9126 2.00435 13.2324C1.92749 12.5512 2.89467 12.1827 2.89467 12.1827L23.3212 3.24632C23.3212 3.24632 25 2.4237 25 3.78509Z"
                                            fill="#7D7D7D"/>
                                    </svg>
                                    <MyInput
                                        register={{
                                            ...register('login', {
                                                pattern: {
                                                    value: /^[A-Za-z\d_]{5,32}$/,
                                                    message: "Никнейм должен содержать символы:A-z, _ Длина: 5-32 символа"
                                                }, required: {
                                                    value: true,
                                                    message: 'Обязательное поле'
                                                }
                                            })
                                        }}
                                        name="login"
                                        className='pl-[40px]'
                                        placeholder="Ник в ТГ"/>
                                </div>
                                <Error>{errors.login && errors.login?.message}</Error>
                            </div>
                            <div className="my-2">
                                <div className='flex relative items-center'>
                                    <LockClosedIcon className="absolute ml-[10px] h-6 w-6 text-gray-500"/>
                                    <MyInput register={{
                                        ...register('password', {
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                                                message: "Пароль должен содержать минимум 8 символов, Буквы A-z, и один из спецсиволов !@#$%^&*"
                                            }, required: {
                                                value: true,
                                                message: 'Обязательное поле'
                                            }
                                        })
                                    }} type="password" name="password"
                                             className="pl-[40px]"
                                             placeholder="Пароль"/>
                                </div>
                                <Error>{errors.password && errors.password?.message}</Error>
                            </div>
                            <div className="my-2">
                                <div className='flex relative items-center'>
                                    <LockClosedIcon className="absolute ml-[10px] h-6 w-6 text-gray-500"/>
                                    <MyInput register={{...register('password2')}} type="password"
                                           name="password2"
                                           className="pl-[40px]"
                                           placeholder="Повторите пароль"/>
                                </div>
                                <Error>{watch('password') !== watch('password2') ? 'Пароли не совпадают' : ''}</Error>
                            </div>
                            <div className='w-full'>
                                <MyButton
                                    className='w-full items-center'
                                    disabled={signUp.isLoading}
                                    type="submit">{!signUp.isLoading ? "Регистрация" :
                                    <div
                                        className="inline-block align-middle animate-spin rounded-full h-[18px] w-[18px] border-t-2 border-b-2 border-white"/>}
                                </MyButton>
                            </div>
                            <div className="w-full flex justify-center mt-8">
                                Уже зарегистрированы?<NavLink className="cursor-pointer pl-1 text-black font-bold"
                                                              to="/login">Авторизация</NavLink>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="w-[50%] my-auto">
                    <img src={cat} className="left-[20px]"
                         alt="cat"/>
                </div>
            </div>
        </div>
    )
}

export default observer(SignInPage);