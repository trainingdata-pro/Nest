import React, {useContext, useMemo, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useForm} from "react-hook-form";
import ManagerService from "../services/ManagerService";
import MyLabel from "./UI/MyLabel";
import MyInput from "./UI/MyInput";


interface FormProps {
    last_name: string,
    first_name: string,
    middle_name: string,
    username: string,
    id: number,
    teamlead: string
}

const FormSection = ({children}: { children: React.ReactNode }) => {
    return (<div className="text-left">{children}</div>)
}
const Profile = ({setIsOpen}: {
    setIsOpen: any
}) => {
    const {store} = useContext(Context)
    const {register, watch, getValues, reset, setValue, handleSubmit} = useForm<FormProps>()
    useMemo(async () => {
        if (store.user_data.teamlead) {
            await ManagerService.fetch_manager(store.user_data.teamlead).then(res => {
                setValue('teamlead', `${res.data.last_name} ${res.data.first_name}`)

            })
        }
        await ManagerService.fetch_manager(store.user_id).then(res => {
            setValue('id', res.data.id);
            setValue('last_name', res.data.last_name);
            setValue('first_name', res.data.first_name);
            setValue('middle_name', res.data.middle_name);
            setValue('username', res.data.username);
        })
    }, []);

    function onSubmit(data: FormProps) {
        ManagerService.patchBaseUser(store.user_id, data).then((res) => {
                setIsOpen(false)
            }
        );
    }

    return (
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex h-2 justify-end w-full">
                <div className="cursor-pointer" onClick={() => setIsOpen(false)}>x</div>
            </div>
            <FormSection>
                <MyLabel required={true}>Фамилия</MyLabel>
                <MyInput autoComplete="new-last_name" register={{...register('last_name', {
                        pattern: {
                            value: /^[А-ЯЁа-яёA-Za-z]+$/,
                            message: "Поле должно содержать символы: A-z,А-я"
                        },
                        required: {
                            value: true,
                            message: 'Обязательное поле'
                        }
                    })}} type="text" placeholder="Фамилия"/>
            </FormSection>
            <FormSection>

                <MyLabel required={true}>Имя</MyLabel>
                <MyInput autoComplete="new-first_name" register={{...register('first_name', {
                        pattern: {
                            value: /^[А-ЯЁа-яёA-Za-z]+$/,
                            message: "Поле должно содержать символы: A-z,А-я"
                        },
                        required: {
                            value: true,
                            message: 'Обязательное поле'
                        }
                    })}} type="text" placeholder="Имя"/>
            </FormSection>
            <FormSection>

                <MyLabel required={false}>Отчество</MyLabel>
                <MyInput register={{...register('middle_name', {
                        pattern: {
                            value: /^[А-ЯЁа-яёA-Za-z]+$/,
                            message: "Поле должно содержать символы: A-z,А-я"
                        },
                    })}} type="text" placeholder="Отчество"/>
            </FormSection>
            <FormSection>

                <MyLabel required={true}>Ник в ТГ</MyLabel>
                <MyInput register={{...register('username', {
                        pattern: {
                            value: /^[A-Za-z\d_]{5,32}$/,
                            message: "Никнейм должен содержать символы:A-z, _ Длина: 5-32 символа"
                        },
                        required: {
                            value: true,
                            message: 'Обязательное поле'
                        }
                    })}} type="text" placeholder="Ник в ТГ"/>
            </FormSection>
            <FormSection>
                <MyLabel required={true}>Ответственный TeamLead</MyLabel>
                <MyInput disabled register={{...register('teamlead', {

                        required: {
                            value: true,
                            message: 'Обязательное поле'
                        }
                    })}} type="text"
                         placeholder="Ответственный TeamLead"/>
            </FormSection>
            <FormSection>
                <MyLabel required={true}>ID</MyLabel>
                <MyInput register={{...register('id')}} type="text" placeholder="ID" disabled={true}/>
            </FormSection>
            <button
                className="bg-[#5970F6] text-white rounded-md w-full text-sm font-medium disabled:opacity-30 transition-colors hover:bg-primary/90 h-10 mt-4 py-2 px-4">Сохранить
            </button>

        </form>
    );
};

export default observer(Profile);