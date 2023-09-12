import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useForm} from "react-hook-form";
import ManagerService from "../services/ManagerService";
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
    teamlead: SelectProps
}

const Profile = ({setIsOpen}: {
    setIsOpen: any
}) => {
    const {store} = useContext(Context)
    useMemo(async () => {
        await ManagerService.fetchOperationsManagers().then((res) => setOperationsManagers(res.data.results.map((operations: any) => {
            return {value: operations.id, label: `${operations.last_name} ${operations.first_name}`}
        })))
        if (store.user_data.teamlead){
            await ManagerService.fetch_manager(store.user_data.teamlead.id).then(res => {
                console.log(res.data)
                setValue('teamlead', {
                    value: res.data.id,
                    label: `${res.data.last_name} ${res.data.first_name}`
                })

            })
        }
        setValue('id', store.user_id);
        setValue('last_name', store.user_data.last_name);
        setValue('first_name', store.user_data.first_name);
        setValue('middle_name', store.user_data.middle_name);
        setValue('username', store.user_data.username);


    }, []);
    const [operationsManagers, setOperationsManagers] = useState<SelectProps[]>([])
    const {register, watch, getValues, reset, setValue, handleSubmit} = useForm<FormProps>(
    )

    function onSubmit() {
        const data = getValues()
        const newData = {...data, teamlead: data.teamlead.value}
        store.user_data.teamlead = newData.teamlead
        ManagerService.patchManager(data.id, newData)
        ManagerService.patchBaseUser(store.user_id, newData).then((res) => {
            setIsOpen(false)
        })
    }

    const handleSelectChange = (value: any) => {
        setValue('teamlead', value);
    };
    return (
        <div>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <section className="">
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
                        isDisabled={store.user_data.is_teamlead || !!store.user_data.teamlead}
                        options={operationsManagers}
                        value={watch('teamlead')}
                        {...register('teamlead', {required: 'Обязательное поле'})}
                        onChange={handleSelectChange}
                    />

                </div>
                <div>
                    <MyLabel required={true}>ID</MyLabel>
                    <MyInput register={{...register('id')}} type="text" placeholder="ID" disabled={true}/>
                </div>
                <button
                    className="bg-black text-white rounded-md w-full text-sm font-medium disabled:opacity-50 transition-colors hover:bg-primary/90 h-10 py-2 px-4">Сохранить
                </button>
            </form>
        </div>
    )
        ;
};

export default observer(Profile);