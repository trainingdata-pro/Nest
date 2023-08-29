import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useForm} from "react-hook-form";
import ManagerService from "../services/ManagerService";
import {ManagerData} from "../store/store";
import {useNavigate} from "react-router-dom";
import Header from "./Header/Header";
import MyLabel from "./UI/MyLabel";
import MyInput from "./UI/MyInput";
import Select from "react-select";

interface SelectProps {
    value: number | string,
    label: string
}

interface FormProps {
    last_name: string,
    first_name: string,
    middle_name: string,
    username: string,
    id: number,
    operational_manager: SelectProps
}

const Profile = () => {
    const {store} = useContext(Context)
    useMemo(async () => {

        await ManagerService.fetchOperationsManagers().then((res) => setOperationsManagers(res.data.results.map((operations: any) => {
            return {value: operations.id, label: `${operations.last_name} ${operations.first_name}`}
        })))
        if (store.managerData.operational_manager){
            await ManagerService.fetch_manager(store.managerData.operational_manager).then(res => {
                console.log(res.data)
                setValue('operational_manager', {
                    value: res.data.id,
                    label: `${res.data.last_name} ${res.data.first_name}`
                })
            })
        }

    }, []);

    useEffect(() => {
        ManagerService.fetch_manager(store.managerData.id).then((res) => {
            setValue('id', res.data.id);
            setValue('last_name', res.data.last_name);
            setValue('first_name', res.data.first_name);
            setValue('middle_name', res.data.middle_name);
            setValue('username', res.data.user.username);
        });
    }, []);
    const navigate = useNavigate()
    const [operationsManagers, setOperationsManagers] = useState<SelectProps[]>([])
    const {register, watch, getValues, reset, setValue, handleSubmit} = useForm<FormProps>(
    )

    function onSubmit() {
        const data = getValues()
        const newData = {...data, operational_manager: data.operational_manager.value}
        store.managerData.operational_manager = newData.operational_manager
        ManagerService.patchManager(data.id, newData)
        ManagerService.patchBaseUser(store.user_id, {'username': getValues('username')}).then((res) => {
            navigate(-1)
        })
    }

    const handleSelectChange = (value: any) => {
        setValue('operational_manager', value);
    };
    return (
        <div className="flex h-screen w-screen items-end justify-center sm:items-center">

            <div className="bg-white fixed z-50 w-full max-w-max border bg-background p-6 opacity-100">

                <form className="w-[40rem] space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <section className="grid grid-cols-3 gap-x-3">
                        <div className="col-span-1">
                            <MyLabel required={true}>Фамилия</MyLabel>
                            <MyInput register={{...register('last_name')}} type="text" placeholder="Фамилия"/>
                        </div>
                        <div className="col-span-1">
                            <MyLabel required={true}>Имя</MyLabel>
                            <MyInput register={{...register('first_name')}} type="text" placeholder="Имя"/>
                        </div>
                        <div className="col-span-1">
                            <MyLabel required={true}>Отчество</MyLabel>
                            <MyInput register={{...register('middle_name')}} type="text" placeholder="Отчество"/>
                        </div>
                    </section>
                    <div>
                        <MyLabel required={true}>Ник в ТГ</MyLabel>
                        <MyInput register={{...register('username')}} type="text" placeholder="Ник в ТГ"/>
                    </div>
                    <div>
                        <MyLabel required={true}>Ответственный TeamLead</MyLabel>
                        <Select
                            isDisabled={store.managerData.is_operational_manager || !!store.managerData.operational_manager}
                            options={operationsManagers}
                            value={watch('operational_manager')}
                            {...register('operational_manager', {required: 'Обязательное поле'})}
                            onChange={handleSelectChange}
                        />

                    </div>
                    <div>
                        <MyLabel required={true}>ID</MyLabel>
                        <MyInput register={{...register('id')}} type="text" placeholder="Фамилия" disabled={true}/>
                    </div>
                    <button
                        className="bg-black text-white rounded-md text-sm font-medium disabled:opacity-50 transition-colors hover:bg-primary/90 h-10 py-2 px-4">Сохранить
                    </button>
                </form>
                <div className="mt-5 flex justify-between">
                    <button
                        className="bg-black text-white rounded-md text-sm font-medium disabled:opacity-50 transition-colors hover:bg-primary/90 h-10 py-2 px-4"
                        onClick={() => {
                            // store.setShowProfile(false)
                            navigate(-1)
                        }}>Закрыть страницу
                    </button>

                </div>
            </div>
        </div>
    )
        ;
};

export default observer(Profile);