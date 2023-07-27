import React, {useContext, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form'
import ProjectService from "../services/ProjectService";
import {Context} from "../index";
import {ManagerData} from "../store/store";
import ManagerService from '../services/ManagerService';
import Select from "react-select";

export interface AddProjectProps {
    manager: number[],
    assessors_count: number,
    backlog: string,
    name: string,
    speed_per_hour: number,
    price_for_assessor: number,
    price_for_costumer: number,
    unloading_value: number,
    unloading_regularity: number,
    status: string,
    date_of_creation: string,
    asana_id: number
}

// @ts-ignore
const AddProject = ({close}) => {
    const {store} = useContext(Context)
    const [managers, setManagers] = useState<ManagerData[]>([])

    useEffect(() => {
        // @ts-ignore
        ManagerService.fetch_managers().then((res) => setManagers(res.data.results));

    },[])
    const [selectedManagers, setSelectedManagers] = useState<any[]>([{"value": store.managerData.id,
        "label": `${store.managerData.last_name} ${store.managerData.first_name}`}])

    const {
        register,
        getValues,
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<AddProjectProps>({
        defaultValues: {
            // @ts-ignore
            manager: selectedManagers,
            assessors_count: 1,
            backlog: "",
            name: "",
            speed_per_hour: 1,
            price_for_assessor: 1,
            price_for_costumer: 1,
            unloading_value: 1,
            unloading_regularity: 1,
            status: "pause",
            date_of_creation: "2023-06-28",
            asana_id: 1
        }
    })
    function onSubmit(data: AddProjectProps) {
        console.log(data)
        ProjectService.addProject(data).then(res => {
            close(false)
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div className="animate-in fade-in fixed inset-0 z-50 bg-white backdrop-blur-sm transition-opacity"></div>
            <div className="bg-white fixed z-50 w-full max-w-lg border bg-background p-6 opacity-100">
                <form onSubmit={handleSubmit(onSubmit)} className="grid columns-1">
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Название проекта <span className="text-red-700">*</span></label>
                        <input
                            className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                            {...register('name', {required: true})}/>
                    </div>
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Asana ID<span className="text-red-700">*</span></label>
                        <input
                            className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                            {...register('asana_id', {required: true})}/>
                    </div>
                    <div className="mb-2">
                        <label>Менеджер проекта <span className="text-red-700">*</span></label>
                        {/*<Select*/}
                        {/*    {...register('manager')}*/}
                        {/*    options={managers.map(manager => ({*/}
                        {/*        value: manager.id,*/}
                        {/*        label: `${manager.last_name} ${manager.first_name}`*/}
                        {/*    }))}*/}
                        {/*    isMulti*/}
                        {/*    value={selectedManagers}*/}
                        {/*    onChange={handleSelectChange}/>*/}
                        <Controller
                            name="manager"
                            control={control}
                            defaultValue={selectedManagers}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    // @ts-ignore
                                    options={managers.map(manager => ({ value: manager.id, label: `${manager.last_name} ${manager.first_name}` }))}
                                    isMulti
                                />)}/>

                    </div>
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Скорость в час</label>
                        <input                             className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                                                           {...register('speed_per_hour')}/>
                    </div>
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Цена за единицу для ассесора</label>
                        <input                             className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                                                           {...register('price_for_assessor')}/>
                    </div>
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Цена за единицу для заказчика</label>
                        <input                             className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                                                           {...register('price_for_costumer')}/>
                    </div>
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Объем выгрузок</label>
                        <input                             className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                                                           {...register('unloading_value')}/>
                    </div>
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Регулярность выгрузок</label>
                        <input                             className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                                                           {...register('unloading_regularity')}/>
                    </div>
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Статус проекта <span className="text-red-700">*</span></label>
                        <input                             className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                                                           {...register('status', {required: true})}/>
                    </div>
                    <div className="mb-2">
                        <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="name">Дата старта проекта</label>
                        <input                             className="flex h-8 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                                                           {...register('date_of_creation')}/>
                    </div>
                    <button className="bg-black text-white rounded-md py-2">Добавить проект</button>
                </form>
            </div>

        </div>
    );
};

export default AddProject;